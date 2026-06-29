import Link from 'next/link';
import { ShoppingCart, Store, Tag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  shop: string;
  category: string;
  compatibility: string;
  image: string;
  condition: 'new' | 'used' | 'refurbished';
}

export default function ProductCard({ product }: { product: Product }) {
  const conditionColors = {
    new: 'bg-teal/10 text-teal border-teal/20',
    used: 'bg-teal-wash text-muted border-teal-border',
    refurbished: 'bg-teal-wash text-teal-dark border-teal-border',
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-teal-border card-shadow card-shadow-hover group">
      {/* Image area */}
      <div className="relative h-44 bg-teal-wash overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-5xl opacity-30">âš™ï¸</div>
        </div>
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${conditionColors[product.condition]}`}>
          {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
        </span>
        <div className="absolute inset-0 bg-teal/0 group-hover:bg-teal/3 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-dark text-sm leading-tight line-clamp-2">{product.name}</h3>
          <span className="text-lg font-black text-teal whitespace-nowrap">â‚¾{product.price}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
          <Tag size={10} />
          <span>{product.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
          <Store size={10} />
          <span>{product.shop}</span>
        </div>

        <p className="text-xs text-subtle mb-4 line-clamp-1">{product.compatibility}</p>

        <div className="flex gap-2">
          <Link
            href={`/parts/${product.id}`}
            className="flex-1 text-center py-2.5 text-sm font-semibold text-dark border-2 border-teal-border rounded-lg hover:border-teal hover:text-teal transition-colors"
          >
            View
          </Link>
          <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-teal rounded-lg hover:bg-teal-dark transition-colors">
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

