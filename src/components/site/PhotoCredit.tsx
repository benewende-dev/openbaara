import { licenseUrl, type Photo } from "@/data/photos";

/** Crédit d'une photo : auteur, licence et source, comme l'exigent les licences Creative Commons. */
export function PhotoCredit({ photo, lang }: { photo: Photo; lang: "fr" | "en" }) {
  const lic = licenseUrl(photo);
  const license = photo.license === "Domaine public" && lang === "en" ? "Public domain" : photo.license;
  return (
    <span className="small muted">
      {lang === "fr" ? "Photo :" : "Photo:"} {photo.author},{" "}
      {lic ? <a className="link !text-[var(--muted)]" href={lic} target="_blank" rel="noopener license">{license}</a> : license}, {" "}
      <a className="link !text-[var(--muted)]" href={photo.source} target="_blank" rel="noopener">Wikimedia Commons</a>
    </span>
  );
}
