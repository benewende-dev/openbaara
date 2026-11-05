// Règle d'accès aux leçons, sur une vraie base de test.
// Lancer avec TEST_DATABASE_URL (sinon ces tests sont ignorés).

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const url = process.env.TEST_DATABASE_URL;
if (url) process.env.DATABASE_URL = url;

const { prisma } = await import("@/lib/db");
const { canOpen, getCourse, getLearnerCourses } = await import("./access");

describe("règle d'ouverture d'une leçon", () => {
  const l = (published: boolean, freePreview: boolean) => ({ id: "x", published, freePreview });
  it("n'ouvre jamais une leçon hors ligne", () => {
    expect(canOpen(l(false, true), true)).toBe(false);
  });
  it("ouvre une leçon publiée à qui a acheté, et l'aperçu gratuit à tous", () => {
    expect(canOpen(l(true, false), true)).toBe(true);
    expect(canOpen(l(true, false), false)).toBe(false);
    expect(canOpen(l(true, true), false)).toBe(true);
  });
});

describe.skipIf(!url)("programme vu par l'apprenant", () => {
  let buyer = "";
  let other = "";
  beforeAll(async () => {
    await prisma.$executeRawUnsafe(
      "TRUNCATE products, prices, customers, entitlements, course_modules, lessons, lesson_progress CASCADE",
    );
    const course = await prisma.product.create({
      data: {
        slug: "cours-test", kind: "course", category: "academy", nameFr: "Cours test", nameEn: "Test course", published: true,
        modules: {
          create: [
            { titleFr: "Vide", titleEn: "Empty", sortOrder: 0 },
            {
              titleFr: "Bases", titleEn: "Basics", sortOrder: 1,
              lessons: {
                create: [
                  { titleFr: "Une", titleEn: "One", published: true, freePreview: true, sortOrder: 0 },
                  { titleFr: "Deux", titleEn: "Two", published: true, sortOrder: 1 },
                  { titleFr: "Brouillon", titleEn: "Draft", published: false, sortOrder: 2 },
                ],
              },
            },
          ],
        },
      },
    });
    buyer = (await prisma.customer.create({ data: { email: "a@test.local", name: "Awa" } })).id;
    other = (await prisma.customer.create({ data: { email: "b@test.local", name: "Koffi" } })).id;
    await prisma.entitlement.create({ data: { customerId: buyer, productId: course.id } });
  });
  afterAll(() => prisma.$disconnect());

  it("ne montre ni les brouillons ni les modules vides", async () => {
    const c = await getCourse("cours-test", buyer);
    expect(c?.modules.map((m) => m.titleFr)).toEqual(["Bases"]);
    expect(c?.flat.map((l) => l.titleFr)).toEqual(["Une", "Deux"]);
    expect(c?.owned).toBe(true);
  });

  it("suit l'avancement et propose la leçon suivante", async () => {
    const c = await getCourse("cours-test", buyer);
    await prisma.lessonProgress.create({ data: { customerId: buyer, lessonId: c!.flat[0].id } });
    const [row] = await getLearnerCourses(buyer);
    expect(row).toMatchObject({ total: 2, completed: 1 });
    expect(row.next?.titleFr).toBe("Deux");
    expect(await getLearnerCourses(other)).toEqual([]);
  });

  it("garde le cours ouvert à l'acheteur quand il est retiré de la vente", async () => {
    await prisma.product.update({ where: { slug: "cours-test" }, data: { published: false } });
    expect(await getCourse("cours-test", buyer)).not.toBeNull();
    expect(await getCourse("cours-test", other)).toBeNull();
    expect(await getCourse("cours-test", null)).toBeNull();
  });
});
