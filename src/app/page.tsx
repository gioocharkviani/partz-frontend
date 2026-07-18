import HomeContent from "@/components/HomeContent";
import { partsApi, shopsApi } from "@/lib/api";
import { toProductCard, toShopCard } from "@/lib/mappers";

export default async function HomePage() {
  const [parts, shops] = await Promise.all([
    partsApi.search({}).catch(() => []),
    shopsApi.list({ sort: "ranking" }).catch(() => []),
  ]);

  const featuredProducts = parts.slice(0, 8).map(toProductCard);
  const featuredShops = shops.slice(0, 4).map(toShopCard);

  return (
    <HomeContent
      parts={parts}
      shops={shops}
      featuredProducts={featuredProducts}
      featuredShops={featuredShops}
    />
  );
}
