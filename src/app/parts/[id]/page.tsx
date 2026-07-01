'use client';

import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, MapPin, CheckCircle, Phone, MessageSquare, Share2, Heart, Check, Package, Shield, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const PART_IMAGES: Record<string, string> = {
  Engine: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
  Electrical: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  Brakes: 'https://images.unsplash.com/photo-1600861194802-a2b11076bc51?w=800&q=80',
  Body: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  Suspension: 'https://images.unsplash.com/photo-1617469767941-7c4dcda70af8?w=800&q=80',
  Exhaust: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
  Cooling: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
  Interior: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80',
};

const PARTS = [
  { id: 1, name: 'BMW N52 Engine Block', price: 1850, condition: 'used' as const, category: 'Engine', brand: 'BMW', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.8, reviewCount: 24, description: 'Excellent condition N52 engine block from 2007 BMW 3 Series. Low mileage, no leaks. Thoroughly tested before listing. Comes with all original gaskets.', partNumber: 'N52B25A', year: '2006-2010', mileage: '87,000 km', warranty: '30 days', shopRating: 4.9, shopReviews: 142 },
  { id: 2, name: 'Mercedes W204 Alternator', price: 280, condition: 'used' as const, category: 'Electrical', brand: 'Mercedes', shop: 'Parts Galaxy', shopId: 2, city: 'Batumi', rating: 4.6, reviewCount: 11, description: 'OEM alternator from C-Class W204. Tested and fully working. Output verified at 120A. Includes original mounting hardware.', partNumber: 'A0141540802', year: '2007-2014', warranty: '14 days', shopRating: 4.7, shopReviews: 88 },
  { id: 3, name: 'Toyota Camry Brake Kit', price: 120, condition: 'new' as const, category: 'Brakes', brand: 'Toyota', shop: 'OEM King', shopId: 3, city: 'Tbilisi', rating: 4.9, reviewCount: 37, description: 'Complete front brake kit — pads and rotors. New OEM Toyota parts. Includes both left and right rotors and a full set of pads. Easy direct fit.', partNumber: 'TK-CAM-BK001', year: '2012-2017', warranty: '12 months', shopRating: 5.0, shopReviews: 203 },
  { id: 4, name: 'Audi A4 Front Bumper', price: 340, condition: 'used' as const, category: 'Body', brand: 'Audi', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.5, reviewCount: 8, description: 'Original Audi A4 B8 front bumper. Minor paint scuffs, no cracks. Parking sensors intact. Color: Phantom Black.', partNumber: '8K0807437', year: '2008-2012', warranty: '7 days', shopRating: 4.9, shopReviews: 142 },
  { id: 5, name: 'Honda Civic Shock Absorber', price: 95, condition: 'new' as const, category: 'Suspension', brand: 'Honda', shop: 'Parts Galaxy', shopId: 2, city: 'Batumi', rating: 4.7, reviewCount: 19, description: 'Front shock absorber for Honda Civic 9th generation. KYB brand. Sold as a single unit. Lifetime guarantee against defects.', partNumber: 'KYB-343416', year: '2011-2015', warranty: 'Lifetime', shopRating: 4.7, shopReviews: 88 },
  { id: 6, name: 'VW Golf Exhaust Manifold', price: 190, condition: 'used' as const, category: 'Exhaust', brand: 'Volkswagen', shop: 'GeoMotors', shopId: 4, city: 'Kutaisi', rating: 4.4, reviewCount: 6, description: 'Cast iron exhaust manifold from Golf V 1.6. Good condition, no cracks. Heat shield included.', partNumber: '036253033S', year: '2003-2008', warranty: '14 days', shopRating: 4.5, shopReviews: 56 },
  { id: 7, name: 'BMW Radiator E90', price: 210, condition: 'new' as const, category: 'Cooling', brand: 'BMW', shop: 'OEM King', shopId: 3, city: 'Tbilisi', rating: 5.0, reviewCount: 31, description: 'Aftermarket aluminum radiator for BMW 3 Series E90. Fits perfectly. Direct replacement. Includes drain plug and mounting clips.', partNumber: '17117521023', year: '2005-2011', warranty: '12 months', shopRating: 5.0, shopReviews: 203 },
  { id: 8, name: 'Mercedes Leather Seat Set', price: 650, condition: 'used' as const, category: 'Interior', brand: 'Mercedes', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.3, reviewCount: 5, description: 'Front and rear leather seats from E-Class W212. Black leather, very good condition. Heating element functional.', year: '2009-2015', warranty: '7 days', shopRating: 4.9, shopReviews: 142 },
  { id: 9, name: 'Toyota Land Cruiser Starter Motor', price: 175, condition: 'used' as const, category: 'Electrical', brand: 'Toyota', shop: 'GeoMotors', shopId: 4, city: 'Kutaisi', rating: 4.6, reviewCount: 13, description: 'Original starter motor for LC100. Fully tested, starts on first crank. Internal solenoid tested.', partNumber: '28100-66020', year: '1998-2007', warranty: '14 days', shopRating: 4.5, shopReviews: 56 },
  { id: 10, name: 'Audi A6 Air Filter', price: 35, condition: 'new' as const, category: 'Engine', brand: 'Audi', shop: 'Parts Galaxy', shopId: 2, city: 'Batumi', rating: 4.8, reviewCount: 42, description: 'Genuine Mahle air filter for Audi A6 C6 2.0 TDI. Direct OEM spec. Easy 5-minute install.', partNumber: 'LX1804', year: '2004-2011', warranty: '12 months', shopRating: 4.7, shopReviews: 88 },
  { id: 11, name: 'Honda Accord Caliper Set', price: 155, condition: 'new' as const, category: 'Brakes', brand: 'Honda', shop: 'OEM King', shopId: 3, city: 'Tbilisi', rating: 4.7, reviewCount: 16, description: 'Remanufactured front brake calipers. Includes brackets and hardware. Pressure tested.', year: '2008-2012', warranty: '6 months', shopRating: 5.0, shopReviews: 203 },
  { id: 12, name: 'BMW M3 Carbon Spoiler', price: 420, condition: 'used' as const, category: 'Body', brand: 'BMW', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.9, reviewCount: 9, description: 'Genuine carbon fiber trunk spoiler from E92 M3. Perfect condition, no chips or delamination. Comes with original mounting hardware.', year: '2008-2013', warranty: '7 days', shopRating: 4.9, shopReviews: 142 },
];

const RELATED_IMAGES = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
  'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80',
  'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=800&q=80',
];

export default function PartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart, items } = useCart();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const part = PARTS.find((p) => p.id === Number(id));

  if (!part) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-dark mb-3">Part not found</h1>
          <Link href="/parts" className="btn-teal">Browse Parts</Link>
        </div>
      </div>
    );
  }

  const images = [PART_IMAGES[part.category] || PART_IMAGES.Engine, ...RELATED_IMAGES.slice(0, 3)];
  const inCart = items.some((i) => i.id === part.id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ id: part.id, name: part.name, price: part.price, shop: part.shop, condition: part.condition, image: images[0] });
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const related = PARTS.filter((p) => p.id !== part.id && (p.category === part.category || p.brand === part.brand)).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <span>/</span>
          <Link href="/parts" className="hover:text-teal transition-colors">Parts</Link>
          <span>/</span>
          <span className="text-dark font-semibold">{part.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-3 border border-teal-border bg-white aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[activeImage]} alt={part.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-teal' : 'border-teal-border hover:border-teal/50'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${part.condition === 'new' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {part.condition === 'new' ? 'NEW' : 'USED'}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-wash border border-teal-border text-teal">{part.category}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-wash border border-teal-border text-teal">{part.brand}</span>
                </div>
                <h1 className="text-2xl font-black text-dark leading-tight">{part.name}</h1>
              </div>
              <button onClick={() => setWishlisted(!wishlisted)}
                className={`p-2.5 rounded-xl border-2 transition-all shrink-0 ${wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-teal-border text-muted hover:border-teal hover:text-teal'}`}>
                <Heart size={18} className={wishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((s) => <Star key={s} size={13} className={s <= Math.floor(part.rating) ? 'fill-yellow text-yellow' : 'text-teal-border fill-teal-border'} />)}
                <span className="font-bold text-dark">{part.rating}</span>
                <span className="text-muted">({part.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted">
                <MapPin size={13} /> {part.city}
              </div>
            </div>

            <div className="text-4xl font-black text-dark mb-5">₾{part.price.toLocaleString()}</div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {part.partNumber && (
                <div className="bg-teal-wash border border-teal-border rounded-xl px-3 py-2.5">
                  <div className="text-xs text-muted font-semibold">Part Number</div>
                  <div className="text-sm font-black text-dark font-mono">{part.partNumber}</div>
                </div>
              )}
              {part.year && (
                <div className="bg-teal-wash border border-teal-border rounded-xl px-3 py-2.5">
                  <div className="text-xs text-muted font-semibold">Year Range</div>
                  <div className="text-sm font-black text-dark">{part.year}</div>
                </div>
              )}
              {(part as { mileage?: string }).mileage && (
                <div className="bg-teal-wash border border-teal-border rounded-xl px-3 py-2.5">
                  <div className="text-xs text-muted font-semibold">Mileage</div>
                  <div className="text-sm font-black text-dark">{(part as { mileage?: string }).mileage}</div>
                </div>
              )}
              <div className="bg-teal-wash border border-teal-border rounded-xl px-3 py-2.5">
                <div className="text-xs text-muted font-semibold">Warranty</div>
                <div className="text-sm font-black text-dark">{(part as { warranty?: string }).warranty}</div>
              </div>
            </div>

            <p className="text-muted text-sm leading-relaxed mb-6">{part.description}</p>

            {/* Qty + Cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0 bg-teal-wash border-2 border-teal-border rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-teal hover:bg-teal/10 font-black transition-colors text-lg">−</button>
                <span className="w-10 text-center font-black text-dark">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-teal hover:bg-teal/10 font-black transition-colors text-lg">+</button>
              </div>
              <button onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all ${justAdded ? 'bg-emerald-500 text-white' : 'bg-teal text-white hover:bg-teal-dark'}`}>
                {justAdded ? <><Check size={16} /> Added to Cart!</> : <><ShoppingCart size={16} /> {inCart ? 'Add More' : 'Add to Cart'}</>}
              </button>
              <Link href="/cart" className="btn-secondary px-4 py-3">
                View Cart
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-xs text-muted hover:text-dark transition-colors px-3 py-2 rounded-lg hover:bg-teal-wash">
                <Share2 size={13} /> Share
              </button>
              <button className="flex items-center gap-2 text-xs text-muted hover:text-dark transition-colors px-3 py-2 rounded-lg hover:bg-teal-wash">
                <MessageSquare size={13} /> Ask a Question
              </button>
            </div>

            {/* Seller card */}
            <div className="mt-6 p-4 bg-white border border-teal-border rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center text-white font-black">
                    {part.shop.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-dark text-sm flex items-center gap-1.5">
                      {part.shop}
                      <CheckCircle size={13} className="text-teal" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Star size={10} className="fill-yellow text-yellow" />
                      {(part as { shopRating?: number }).shopRating} · {(part as { shopReviews?: number }).shopReviews} reviews
                    </div>
                  </div>
                </div>
                <Link href={`/shops/${part.shopId}`} className="text-xs font-bold text-teal hover:underline">Visit Shop →</Link>
              </div>
              <div className="flex gap-2">
                <a href="tel:+995599000000" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-teal-border text-sm font-bold text-teal hover:bg-teal hover:text-white hover:border-teal transition-all">
                  <Phone size={14} /> Call Seller
                </a>
                <Link href={`/shops/${part.shopId}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-wash border-2 border-teal-border text-sm font-bold text-dark hover:bg-teal-border transition-colors">
                  <Package size={14} /> More from Shop
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { icon: Shield, text: 'Buyer Protection' },
                { icon: Truck, text: 'Fast Delivery' },
                { icon: Check, text: 'Verified Part' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 p-2.5 bg-teal-wash border border-teal-border rounded-xl text-center">
                  <Icon size={16} className="text-teal" />
                  <span className="text-xs font-semibold text-muted">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related parts */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-dark mb-5">Related Parts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/parts/${p.id}`}
                  className="bg-white rounded-2xl border border-teal-border overflow-hidden card-shadow hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="h-32 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PART_IMAGES[p.category] || PART_IMAGES.Engine} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-teal mb-0.5">{p.brand}</div>
                    <h3 className="font-black text-dark text-xs leading-tight mb-2 line-clamp-2">{p.name}</h3>
                    <div className="text-sm font-black text-dark">₾{p.price.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
