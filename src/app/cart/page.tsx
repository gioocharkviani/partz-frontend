'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Check, MapPin, CreditCard, Phone, User, Mail } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', notes: '', payment: 'cash' });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleOrder = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setOrderDone(true);
    clearCart();
    setSubmitting(false);
  };

  if (orderDone) {
    return (
      <div className="min-h-screen bg-teal-wash flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 card-shadow border border-teal-border text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-teal" />
          </div>
          <h1 className="text-2xl font-black text-dark mb-2">Order Placed!</h1>
          <p className="text-muted mb-6">The seller will contact you shortly to confirm your order and arrange delivery.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/parts" className="btn-teal">Browse More Parts</Link>
            <Link href="/dashboard" className="btn-secondary">My Dashboard</Link>
          </div>
        </div>
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
          <h1 className="text-2xl font-black text-dark mb-2">Your cart is empty</h1>
          <p className="text-muted mb-6">Browse our catalog and add parts to your cart.</p>
          <Link href="/parts" className="btn-teal">Browse Parts</Link>
        </div>
      </div>
    );
  }

  const delivery = 15;
  const grandTotal = total + delivery;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/parts" className="p-2 rounded-xl hover:bg-teal-wash border border-teal-border transition-colors text-muted hover:text-teal">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-dark">Shopping Cart</h1>
            <p className="text-muted text-sm">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-teal-border p-4 card-shadow flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-dark text-sm leading-tight mb-0.5">{item.name}</h3>
                      <p className="text-xs text-muted">{item.shop}</p>
                      <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${item.condition === 'new' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {item.condition === 'new' ? 'New' : 'Used'}
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
                      <div className="text-lg font-black text-dark">₾{(item.price * item.quantity).toLocaleString()}</div>
                      {item.quantity > 1 && <div className="text-xs text-muted">₾{item.price.toLocaleString()} each</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-sm text-muted hover:text-red-500 transition-colors flex items-center gap-1.5 mt-2">
              <Trash2 size={13} /> Clear all items
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-teal-border p-5 card-shadow sticky top-24">
              <h2 className="font-black text-dark text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal ({count} items)</span>
                  <span className="font-bold text-dark">₾{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Delivery</span>
                  <span className="font-bold text-dark">₾{delivery}</span>
                </div>
                <div className="border-t border-teal-border pt-3 flex justify-between">
                  <span className="font-black text-dark">Total</span>
                  <span className="font-black text-dark text-xl">₾{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {!checkoutOpen ? (
                <button onClick={() => setCheckoutOpen(true)} className="btn-teal w-full justify-center py-3.5">
                  <CreditCard size={16} /> Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-black text-dark text-sm uppercase tracking-wider">Delivery Details</h3>
                  <div className="input-wrap">
                    <span className="input-icon"><User size={13} /></span>
                    <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name *" />
                  </div>
                  <div className="input-wrap">
                    <span className="input-icon"><Phone size={13} /></span>
                    <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Phone number *" />
                  </div>
                  <div className="input-wrap">
                    <span className="input-icon"><Mail size={13} /></span>
                    <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email" />
                  </div>
                  <div className="input-wrap">
                    <span className="input-icon"><MapPin size={13} /></span>
                    <input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Delivery address *" />
                  </div>
                  <div>
                    <label className="field-label">Payment Method</label>
                    <div className="flex gap-2">
                      {[{ v: 'cash', l: 'Cash on Delivery' }, { v: 'card', l: 'Card' }, { v: 'transfer', l: 'Bank Transfer' }].map(({ v, l }) => (
                        <button key={v} onClick={() => set('payment', v)}
                          className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${form.payment === v ? 'bg-teal border-teal text-white' : 'border-teal-border text-muted hover:border-teal'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Notes (optional)" rows={2}
                    className="input-base text-sm resize-none" />
                  <button onClick={handleOrder} disabled={!form.name || !form.phone || !form.address || submitting}
                    className="btn-teal w-full justify-center py-3.5">
                    {submitting
                      ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : `Place Order — ₾${grandTotal.toLocaleString()}`}
                  </button>
                  <button onClick={() => setCheckoutOpen(false)} className="w-full text-center text-xs text-muted hover:text-dark transition-colors">
                    Cancel
                  </button>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-teal-border">
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                  <Check size={12} className="text-teal" /> Verified sellers only
                </div>
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                  <Check size={12} className="text-teal" /> Buyer protection guarantee
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Check size={12} className="text-teal" /> Free returns within 7 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
