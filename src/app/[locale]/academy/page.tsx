import { getCatalogue } from "@/lib/shop/catalogue";
import { AcademyView } from "./AcademyView";

// Catalogue lu en base au prix en vigueur : un prix changé dans la console s'affiche ici.
export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  const products = await getCatalogue(["course"]);
  return <AcademyView products={products} />;
}
