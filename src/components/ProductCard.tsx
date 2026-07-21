'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Store, Tag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

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

const PART_IMAGES: Record<string, string> = {
  'Engine':       'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
  'Electrical':   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'Brakes':       'https://images.unsplash.com/photo-1600861194802-a2b11076bc51?w=600&q=80',
  'Suspension':   'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80',
  'Body & Exterior': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
  'Lighting':     'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
  'Transmission': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80',
  'default':      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  const conditionColors = {
    new: 'bg-teal/10 text-teal border-teal/20',
    used: 'bg-teal-wash text-muted border-teal-border',
    refurbished: 'bg-amber-light text-amber border-amber/20',
  };

  const imgSrc = product.image || PART_IMAGES[product.category] || PART_IMAGES['default'];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-teal-border card-shadow card-shadow-hover group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${conditionColors[product.condition]}`}>
          {t(`product.${product.condition}`)}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-dark text-sm leading-tight line-clamp-2">{product.name}</h3>
          <span className="text-lg font-black text-teal whitespace-nowrap">₾{product.price}</span>
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
            {t('product.view')}
          </Link>
          <button onClick={handleAdd} disabled={adding}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-teal rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-60">
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
