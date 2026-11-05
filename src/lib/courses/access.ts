// ─── Ce qu'un apprenant peut ouvrir ───
// Règle unique : une leçon s'ouvre si elle est publiée ET (le cours est acheté OU c'est un aperçu gratuit).

import "server-only";
import { prisma } from "@/lib/db";

export type LessonRef = { id: string; published: boolean; freePreview: boolean };

export function canOpen(lesson: LessonRef, owned: boolean): boolean {
  return lesson.published && (owned || lesson.freePreview);
}

/**
 * Programme publié d'un cours et ce que l'apprenant en possède.
 * Un cours retiré de la vente reste ouvert à ceux qui l'ont acheté.
 */
export async function getCourse(slug: string, customerId: string | null) {
  const product = await prisma.product.findFirst({
    where: { slug, kind: "course" },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: { lessons: { where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
      },
    },
  });
  if (!product) return null;
  const owned = customerId
    ? Boolean(await prisma.entitlement.findUnique({ where: { customerId_productId: { customerId, productId: product.id } } }))
    : false;
  if (!product.published && !owned) return null;
  const lessonIds = product.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const done = customerId
    ? new Set(
        (await prisma.lessonProgress.findMany({ where: { customerId, lessonId: { in: lessonIds } }, select: { lessonId: true } })).map((p) => p.lessonId),
      )
    : new Set<string>();
  const modules = product.modules.filter((m) => m.lessons.length > 0);
  const flat = modules.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m })));
  return { product, owned, done, modules, flat };
}

/** Cours achetés, avec l'avancement et la prochaine leçon à suivre. */
export async function getLearnerCourses(customerId: string) {
  const rights = await prisma.entitlement.findMany({
    where: { customerId, product: { kind: "course" } },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return Promise.all(
    rights.map(async (r) => {
      const course = await getCourse(r.product.slug, customerId);
      const total = course?.flat.length ?? 0;
      const completed = course ? course.flat.filter((l) => course.done.has(l.id)).length : 0;
      const next = course?.flat.find((l) => !course.done.has(l.id)) ?? course?.flat[0] ?? null;
      return { product: r.product, total, completed, next };
    }),
  );
}
