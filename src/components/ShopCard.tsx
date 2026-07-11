import Link from 'next/link';
import { MapPin, Package, CheckCircle, Star } from 'lucide-react';

interface Shop {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  productCount?: number;
  categories: string[];
  verified: boolean;
  coverColor: string;
  coverImage?: string;
}

const SHOP_COVERS = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80',
  'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=800&q=80',
];

export default function ShopCard({ shop }: { shop: Shop }) {
  const cover = shop.coverImage || SHOP_COVERS[(shop.id - 1) % SHOP_COVERS.length];

  return (
    <Link href={`/shops/${shop.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-teal-border card-shadow card-shadow-hover">

        {/* Cover photo */}
        <div className="h-32 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

          {/* Shop initial — bottom-left over cover */}
          <div className="absolute bottom-3 left-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white shadow-lg flex items-center justify-center text-teal font-black text-lg border-2 border-white">
              {shop.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-white text-sm leading-tight drop-shadow">{shop.name}</h3>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <MapPin size={9} /> {shop.location}
              </div>
            </div>
          </div>

          {shop.verified && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/95 text-teal text-xs font-bold px-2 py-0.5 rounded-full shadow">
              <CheckCircle size={10} className="text-teal" />
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={13} className="fill-yellow text-yellow" />
            <span className="text-sm font-bold text-dark">{shop.rating}</span>
            <span className="text-xs text-subtle">({shop.reviewCount} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {shop.categories.slice(0, 3).map((cat) => (
              <span key={cat} className="text-xs px-2 py-0.5 bg-teal-wash border border-teal-border rounded-full text-teal-dark font-medium">
                {cat}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-teal-border">
            {shop.productCount != null ? (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Package size={11} />
                <span>{shop.productCount} products</span>
              </div>
            ) : <span />}
            <span className="text-xs font-bold text-teal group-hover:underline">Visit →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
