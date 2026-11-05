import { getCatalogue } from "@/lib/shop/catalogue";
import { StoreView } from "./StoreView";

// Catalogue lu en base au prix en vigueur : un prix changé dans la console s'affiche ici.
export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await getCatalogue(["course", "tool", "service"]);
  return <StoreView products={products} />;
}
