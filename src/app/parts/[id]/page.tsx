'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, MapPin, CheckCircle, Phone, MessageSquare, Check, Package, Shield, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { partsApi, resolveUploadUrl } from '@/lib/api';

export default function PartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [part, setPart] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    partsApi.get(Number(id))
      .then((p) => {
        setPart(p);
        setActiveImage(0);
        if (p?.brand_id) {
          partsApi.search({ brand_id: p.brand_id }).then((list) => {
            setRelated(list.filter((r: any) => r.id !== p.id).slice(0, 4));
          }).catch(() => {});
        }
      })
      .catch(() => setPart(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

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

  const images: string[] = (part.images || []).map((u: string) => resolveUploadUrl(u));

  const handleAdd = async () => {
    await addToCart(part.id, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <span>/</span>
          <Link href="/parts" className="hover:text-teal transition-colors flex items-center gap-1"><ArrowLeft size={11} /> Parts</Link>
          <span>/</span>
          <span className="text-dark font-semibold">{part.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-3 border border-teal-border bg-white aspect-[4/3] flex items-center justify-center">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[activeImage]} alt={part.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">🔧</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-teal' : 'border-teal-border hover:border-teal/50'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${part.condition === 'new' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {part.condition === 'new' ? 'NEW' : 'USED'}
                  </span>
                  {part.category?.name && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-wash border border-teal-border text-teal">{part.category.name}</span>}
                  {part.brand?.name && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-wash border border-teal-border text-teal">{part.brand.name}</span>}
                </div>
                <h1 className="text-2xl font-black text-dark leading-tight">{part.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
              {part.shop?.rating_avg != null && (
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className={s <= Math.round(Number(part.shop.rating_avg)) ? 'fill-yellow text-yellow' : 'text-teal-border fill-teal-border'} />)}
                  <span className="font-bold text-dark">{Number(part.shop.rating_avg).toFixed(1)}</span>
                  <span className="text-muted">({part.shop.reviews_count || 0} shop reviews)</span>
                </div>
              )}
              {part.shop?.city && (
                <div className="flex items-center gap-1 text-muted">
                  <MapPin size={13} /> {part.shop.city}
                </div>
              )}
            </div>

            <div className="text-4xl font-black text-dark mb-5">₾{Number(part.price).toLocaleString()}</div>

            {/* Specs */}
            {(part.part_number || part.year) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {part.part_number && (
                  <div className="bg-teal-wash border border-teal-border rounded-xl px-3 py-2.5">
                    <div className="text-xs text-muted font-semibold">Part Number</div>
                    <div className="text-sm font-black text-dark font-mono">{part.part_number}</div>
                  </div>
                )}
                {part.year && (
                  <div className="bg-teal-wash border border-teal-border rounded-xl px-3 py-2.5">
                    <div className="text-xs text-muted font-semibold">Year Range</div>
                    <div className="text-sm font-black text-dark">{part.year}</div>
                  </div>
                )}
              </div>
            )}

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
                {justAdded ? <><Check size={16} /> Added to Cart!</> : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>
              <Link href="/cart" className="btn-secondary px-4 py-3">
                View Cart
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-xs text-muted hover:text-dark transition-colors px-3 py-2 rounded-lg hover:bg-teal-wash">
                <MessageSquare size={13} /> Ask a Question
              </button>
            </div>

            {/* Seller card */}
            {part.shop && (
              <div className="mt-6 p-4 bg-white border border-teal-border rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center text-white font-black">
                      {part.shop.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-dark text-sm flex items-center gap-1.5">
                        {part.shop.name}
                        <CheckCircle size={13} className="text-teal" />
                      </div>
                      {part.shop.rating_avg != null && (
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <Star size={10} className="fill-yellow text-yellow" />
                          {Number(part.shop.rating_avg).toFixed(1)} · {part.shop.reviews_count || 0} reviews
                        </div>
                      )}
                    </div>
                  </div>
                  <Link href={`/shops/${part.shop.id}`} className="text-xs font-bold text-teal hover:underline">Visit Shop →</Link>
                </div>
                <div className="flex gap-2">
                  {part.shop.phone && (
                    <a href={`tel:${part.shop.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-teal-border text-sm font-bold text-teal hover:bg-teal hover:text-white hover:border-teal transition-all">
                      <Phone size={14} /> Call Seller
                    </a>
                  )}
                  <Link href={`/shops/${part.shop.id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-wash border-2 border-teal-border text-sm font-bold text-dark hover:bg-teal-border transition-colors">
                    <Package size={14} /> More from Shop
                  </Link>
                </div>
              </div>
            )}

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
              {related.map((p) => {
                const img = p.images?.[0] ? resolveUploadUrl(p.images[0]) : '';
                return (
                  <Link key={p.id} href={`/parts/${p.id}`}
                    className="bg-white rounded-2xl border border-teal-border overflow-hidden card-shadow hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="h-32 overflow-hidden bg-teal-wash flex items-center justify-center">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : <span className="text-2xl">🔧</span>}
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold text-teal mb-0.5">{p.brand?.name}</div>
                      <h3 className="font-black text-dark text-xs leading-tight mb-2 line-clamp-2">{p.name}</h3>
                      <div className="text-sm font-black text-dark">₾{Number(p.price).toLocaleString()}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
