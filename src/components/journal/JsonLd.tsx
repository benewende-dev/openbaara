/** Données structurées schema.org, lues par Google et les moteurs IA. */
export function JsonLd({ data }: { data: object | object[] }) {
  // « < » échappé : le JSON ne peut pas refermer la balise script.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
