'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Check, MapPin, CreditCard, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ordersApi, getUser, resolveUploadUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi'];

export default function CartPage() {
  const { items, loading, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const { t } = useLanguage();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const user = getUser();
  const [form, setForm] = useState({ phone: '', address: '', city: '', notes: '', payment: 'cash' });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const paymentOptions = [
    { v: 'cash', l: t('cart.cashOnDelivery') },
    { v: 'card', l: t('cart.card') },
    { v: 'transfer', l: t('cart.bankTransfer') },
  ];

  const handleOrder = async () => {
    setSubmitting(true);
    setError('');
    try {
      await ordersApi.placeOrder({
        delivery_address: form.address,
        delivery_city: form.city,
        phone: form.phone,
        payment_method: form.payment,
        notes: form.notes || undefined,
      });
      setOrderDone(true);
    } catch (e: any) {
      setError(e.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (orderDone) {
    return (
      <div className="min-h-screen bg-teal-wash flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 card-shadow border border-teal-border text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-teal" />
          </div>
          <h1 className="text-2xl font-black text-dark mb-2">{t('cart.orderPlaced')}</h1>
          <p className="text-muted mb-6">{t('cart.orderPlacedDesc')}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/parts" className="btn-teal">{t('cart.browseMoreParts')}</Link>
            <Link href="/dashboard" className="btn-secondary">{t('cart.myDashboard')}</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-teal-wash border-2 border-teal-border flex items-center justify-center mx-auto mb-5">
            <ShoppingCart size={32} className="text-muted" />
          </div>
          <h1 className="text-2xl font-black text-dark mb-2">{t('cart.signInTitle')}</h1>
          <p className="text-muted mb-6">{t('cart.signInDesc')}</p>
          <Link href="/auth/login?redirect=/cart" className="btn-teal">{t('auth.submitLogin')}</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-teal-wash border-2 border-teal-border flex items-center justify-center mx-auto mb-5">
            <ShoppingCart size={32} className="text-muted" />
          </div>
          <h1 className="text-2xl font-black text-dark mb-2">{t('cart.empty')}</h1>
          <p className="text-muted mb-6">{t('cart.emptyDesc')}</p>
          <Link href="/parts" className="btn-teal">{t('cart.browseParts')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/parts" className="p-2 rounded-xl hover:bg-teal-wash border border-teal-border transition-colors text-muted hover:text-teal">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-dark">{t('cart.shoppingCart')}</h1>
            <p className="text-muted text-sm">{count} {count === 1 ? t('cart.itemSingular') : t('cart.itemPlural')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const part = item.part || {};
              const img = part.images?.[0] ? resolveUploadUrl(part.images[0]) : '';
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-teal-border p-4 card-shadow flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-teal-wash flex items-center justify-center">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={part.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingCart size={24} className="text-teal-border" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-dark text-sm leading-tight mb-0.5">{part.name}</h3>
                        <p className="text-xs text-muted">{part.shop?.name}</p>
                        <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${part.condition === 'new' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {part.condition === 'new' ? t('product.new') : t('product.used')}
                        </span>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-teal-wash border border-teal-border rounded-xl overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1.5 text-teal hover:bg-teal/10 transition-colors">
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-dark">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1.5 text-teal hover:bg-teal/10 transition-colors">
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-dark">₾{(Number(part.price || 0) * item.quantity).toLocaleString()}</div>
                        {item.quantity > 1 && <div className="text-xs text-muted">₾{Number(part.price || 0).toLocaleString()} {t('cart.each')}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button onClick={() => clearCart()} className="text-sm text-muted hover:text-red-500 transition-colors flex items-center gap-1.5 mt-2">
              <Trash2 size={13} /> {t('cart.clearAll')}
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-teal-border p-5 card-shadow sticky top-24">
              <h2 className="font-black text-dark text-lg mb-4">{t('cart.orderSummary')}</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{t('cart.subtotalItems')} ({count} {count === 1 ? t('cart.itemSingular') : t('cart.itemPlural')})</span>
                  <span className="font-bold text-dark">₾{total.toLocaleString()}</span>
                </div>
                <div className="border-t border-teal-border pt-3 flex justify-between">
                  <span className="font-black text-dark">{t('cart.total')}</span>
                  <span className="font-black text-dark text-xl">₾{total.toLocaleString()}</span>
                </div>
              </div>

              {!checkoutOpen ? (
                <button onClick={() => setCheckoutOpen(true)} className="btn-primary w-full justify-center py-3.5">
                  <CreditCard size={16} /> {t('cart.proceedToCheckout')}
                </button>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-black text-dark text-sm uppercase tracking-wider">{t('cart.deliveryDetails')}</h3>
                  <div className="input-wrap">
                    <span className="input-icon"><Phone size={13} /></span>
                    <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder={t('cart.phonePlaceholder')} />
                  </div>
                  <div className="input-wrap">
                    <span className="input-icon"><MapPin size={13} /></span>
                    <input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder={t('cart.addressPlaceholder')} />
                  </div>
                  <div className="input-wrap">
                    <select value={form.city} onChange={(e) => set('city', e.target.value)} className="bg-white appearance-none">
                      <option value="">{t('cart.selectCityPlaceholder')}</option>
                      {CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">{t('cart.paymentMethod')}</label>
                    <div className="flex gap-2">
                      {paymentOptions.map(({ v, l }) => (
                        <button key={v} onClick={() => set('payment', v)}
                          className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${form.payment === v ? 'bg-teal border-teal text-white' : 'border-teal-border text-muted hover:border-teal'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder={t('cart.notesPlaceholder')} rows={2}
                    className="input-base text-sm resize-none" />
                  {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}
                  <button onClick={handleOrder} disabled={!form.phone || !form.address || !form.city || submitting}
                    className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
                    {submitting
                      ? <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
                      : `${t('cart.placeOrder')} — ₾${total.toLocaleString()}`}
                  </button>
                  <button onClick={() => setCheckoutOpen(false)} className="w-full text-center text-xs text-muted hover:text-dark transition-colors">
                    {t('cart.cancel')}
                  </button>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-teal-border">
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                  <Check size={12} className="text-teal" /> {t('cart.verifiedSellersOnly')}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Check size={12} className="text-teal" /> {t('cart.paymentHeld')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
