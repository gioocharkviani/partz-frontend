import { resolveUploadUrl } from './api';

/** Maps a real `Part` API record onto the shape `ProductCard` expects. */
export function toProductCard(part: any) {
  return {
    id: part.id,
    name: part.name,
    price: Number(part.price),
    shop: part.shop?.name || '',
    category: part.category?.name || 'Parts',
    compatibility: [part.brand?.name, part.model?.name, part.year].filter(Boolean).join(' ') || 'Universal fit',
    image: part.images?.[0] ? resolveUploadUrl(part.images[0]) : '',
    condition: (part.condition as 'new' | 'used' | 'refurbished') || 'used',
  };
}

/** Maps a real `Shop` API record onto the shape `ShopCard` expects. */
export function toShopCard(shop: any) {
  return {
    id: shop.id,
    name: shop.name,
    location: shop.city || 'Georgia',
    rating: Number(shop.rating_avg || 0),
    reviewCount: shop.reviews_count || 0,
    categories: (shop.categories || []).map((c: any) => c.name),
    verified: shop.completed_orders_count > 0,
    coverColor: 'gradient-teal',
    coverImage: shop.cover_image ? resolveUploadUrl(shop.cover_image) : undefined,
  };
}
