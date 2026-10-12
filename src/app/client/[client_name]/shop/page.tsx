import { ThemedShopHome } from "@/components/shop/pages/home-page";
import { clientSeller } from "@/lib/shop/server";

export default async function ClientShopHomePage({ params }: { params: Promise<{ client_name: string }> }) {
  return <ThemedShopHome seller={await clientSeller(params)} />;
}
