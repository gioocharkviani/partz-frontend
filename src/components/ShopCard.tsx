import Link from 'next/link';
import { MapPin, Package, CheckCircle } from 'lucide-react';
import StarRating from './StarRating';

interface Shop {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  categories: string[];
  verified: boolean;
  coverColor: string;
}

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shops/${shop.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-teal-border card-shadow card-shadow-hover">
        {/* Cover */}
        <div className={`h-20 ${shop.coverColor} relative`}>
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#fff_0px,#fff_1px,transparent_1px,transparent_10px)]" />
          {shop.verified && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              <CheckCircle size={10} className="fill-white" />
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <div className="-mt-5 mb-3 w-10 h-10 rounded-xl bg-white border-2 border-teal-border shadow-sm flex items-center justify-center text-teal font-black text-base">
            {shop.name.charAt(0)}
          </div>

          <h3 className="font-bold text-dark text-sm group-hover:text-teal transition-colors mb-0.5 leading-tight">{shop.name}</h3>

          <div className="flex items-center gap-1 text-xs text-muted mb-2">
            <MapPin size={10} />
            {shop.location}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={shop.rating} size={12} />
            <span className="text-xs text-subtle">({shop.reviewCount})</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {shop.categories.slice(0, 3).map((cat) => (
              <span key={cat} className="text-xs px-2 py-0.5 bg-teal-wash border border-teal-border rounded-full text-teal-dark font-medium">
                {cat}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-teal-border">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Package size={11} />
              <span>{shop.productCount} products</span>
            </div>
            <span className="text-xs font-bold text-teal group-hover:underline">Visit →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
