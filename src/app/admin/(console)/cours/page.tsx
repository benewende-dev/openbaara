import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Cours de l'Academy" };

export default async function CoursesPage() {
  await requireAdmin();
  const courses = await prisma.product.findMany({
    where: { kind: "course" },
    orderBy: [{ sortOrder: "asc" }],
    include: {
      modules: { include: { lessons: { select: { published: true, videoId: true, kind: true } } } },
      _count: { select: { entitlements: true } },
    },
  });

  return (
    <>
      <div className="head">
        <div>
          <h1>Cours de l&apos;Academy</h1>
          <p className="muted" style={{ margin: "4px 0 0" }}>Programme de chaque cours : modules et leçons. Une leçon n&apos;est visible des apprenants qu&apos;une fois publiée.</p>
        </div>
      </div>
      <table className="t">
        <thead><tr><th>Cours</th><th className="r">Modules</th><th className="r">Leçons en ligne</th><th className="r">Vidéos rattachées</th><th className="r">Inscrits</th><th></th></tr></thead>
        <tbody>
          {courses.map((c) => {
            const lessons = c.modules.flatMap((m) => m.lessons);
            const online = lessons.filter((l) => l.published).length;
            const videos = lessons.filter((l) => l.kind === "video");
            return (
              <tr key={c.id}>
                <td><Link href={`/admin/cours/${c.id}`} style={{ fontWeight: 500, textDecoration: "none" }}>{c.nameFr}</Link><div className="small muted mono">{c.slug}</div></td>
                <td className="r num">{c.modules.length}</td>
                <td className="r num">{online} / {lessons.length}</td>
                <td className="r num">{videos.filter((l) => l.videoId).length} / {videos.length}</td>
                <td className="r num">{c._count.entitlements}</td>
                <td className="r"><Link href={`/admin/cours/${c.id}`} className="btn sm">Programme</Link></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
