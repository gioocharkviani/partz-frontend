'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, Clock, CheckCircle, XCircle, ChevronRight, Plus, Bell,
  MessageCircle, Store, Users, ShoppingBag, MapPin, Phone, Building2,
  Camera, Edit3, ArrowRight,
} from 'lucide-react';
import StarRating from '@/components/StarRating';

const requests = [
  { id: 1, part: 'BMW E46 Front Bumper', vehicle: 'BMW 3 Series 2003', status: 'offers', offerCount: 5, date: '2h ago' },
  { id: 2, part: 'Gearbox ECU VW Golf V', vehicle: 'VW Golf 5 2005', status: 'pending', offerCount: 0, date: '1 day ago' },
  { id: 3, part: 'Right Headlight Mercedes W211', vehicle: 'Mercedes E220 2007', status: 'completed', offerCount: 3, date: '3 days ago' },
  { id: 4, part: 'Timing Belt Kit', vehicle: 'Ford Focus 2.0 2008', status: 'cancelled', offerCount: 1, date: '1 week ago' },
];

const offers = [
  { id: 1, shop: 'AutoParts Tbilisi', price: 320, condition: 'Used OEM', delivery: '2-3 days', rating: 4.8 },
  { id: 2, shop: 'LuxAuto Parts', price: 280, condition: 'Used', delivery: '1 day', rating: 4.7 },
  { id: 3, shop: 'BudgetAuto GE', price: 190, condition: 'Used (minor scratch)', delivery: '3-5 days', rating: 3.9 },
];

const orders = [
  { id: 1, part: 'Brake Disc Set Toyota', shop: 'BrakeMaster GE', price: 95, status: 'delivered', date: '2024-05-20' },
  { id: 2, part: 'Air Filter Opel Astra', shop: 'CheapParts GE', price: 22, status: 'shipped', date: '2024-05-25' },
];

const statusConfig = {
  offers: { label: 'Offers Received', color: 'bg-teal/10 text-teal border-teal/20', icon: Bell },
  pending: { label: 'Waiting', color: 'bg-yellow/15 text-dark border-yellow/25', icon: Clock },
  completed: { label: 'Completed', color: 'bg-teal/10 text-teal border-teal/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-500 border-red-100', icon: XCircle },
};

const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi'];

type Tab = 'requests' | 'offers' | 'orders';
type UserRole = 'buyer' | 'seller';
type View = 'main' | 'create-shop' | 'edit-profile';

interface ShopForm {
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  categories: string[];
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('requests');
  const [role, setRole] = useState<UserRole>('buyer');
  const [view, setView] = useState<View>('main');
  const [shopCreated, setShopCreated] = useState(false);
  const [shopForm, setShopForm] = useState<ShopForm>({
    name: '', description: '', city: '', address: '', phone: '', categories: [],
  });
  const [creating, setCreating] = useState(false);
  const [editRole, setEditRole] = useState<UserRole>(role);

  const setShop = (k: keyof ShopForm, v: string) => setShopForm((p) => ({ ...p, [k]: v }));

  const handleCreateShop = async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setShopCreated(true);
    setCreating(false);
    setView('main');
  };

  /* ── Create Shop View ── */
  if (view === 'create-shop') {
    return (
      <div className="min-h-screen bg-white">
        <div className="gradient-teal py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-4">
            <button onClick={() => setView('main')} className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors">
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <div>
              <p className="text-white/60 text-sm">Dashboard</p>
              <h1 className="text-xl font-black text-white">Create Your Shop</h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Cover photo placeholder */}
          <div className="relative h-40 bg-teal-wash border-2 border-dashed border-teal-border rounded-2xl mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-teal/5 transition-colors group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
              alt="Shop cover"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-30 group-hover:opacity-40 transition-opacity"
            />
            <div className="relative z-10 flex flex-col items-center gap-2 text-teal-dark">
              <Camera size={28} />
              <span className="text-sm font-bold">Upload Cover Photo</span>
              <span className="text-xs text-muted">Recommended: 1200×400px</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="field-label">Shop Name *</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input value={shopForm.name} onChange={(e) => setShop('name', e.target.value)} placeholder="e.g. AutoParts Tbilisi" className="input-base pl-9" />
              </div>
            </div>

            <div>
              <label className="field-label">Description</label>
              <textarea value={shopForm.description} onChange={(e) => setShop('description', e.target.value)}
                placeholder="Tell buyers about your shop, what you specialize in..."
                rows={3} className="input-base resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">City *</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <select value={shopForm.city} onChange={(e) => setShop('city', e.target.value)} className="input-base pl-9 bg-white appearance-none">
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Phone *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input type="tel" value={shopForm.phone} onChange={(e) => setShop('phone', e.target.value)} placeholder="+995 5XX XXX XXX" className="input-base pl-9" />
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Address</label>
              <input value={shopForm.address} onChange={(e) => setShop('address', e.target.value)} placeholder="Street address" className="input-base" />
            </div>

            <div className="bg-teal-wash border border-teal-border rounded-xl p-4 text-sm text-muted">
              <p className="font-semibold text-dark mb-1">What happens next?</p>
              Your shop will be visible to buyers immediately. You can then add products from the Seller Dashboard and start receiving requests.
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setView('main')} className="btn-secondary px-6">Cancel</button>
              <button
                onClick={handleCreateShop}
                disabled={!shopForm.name || !shopForm.city || !shopForm.phone || creating}
                className="btn-primary flex-1 justify-center"
              >
                {creating
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Store size={16} /> Create Shop</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Edit Profile View ── */
  if (view === 'edit-profile') {
    return (
      <div className="min-h-screen bg-white">
        <div className="gradient-teal py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-4">
            <button onClick={() => setView('main')} className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors">
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <div>
              <p className="text-white/60 text-sm">Dashboard</p>
              <h1 className="text-xl font-black text-white">Edit Profile Type</h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-muted text-sm mb-6">Change your account type. This affects what features are available to you.</p>

          <div className="space-y-3 mb-8">
            {[
              { type: 'buyer' as UserRole, icon: ShoppingBag, title: 'Buyer', subtitle: 'Search for parts, send requests, get offers from verified sellers.' },
              { type: 'seller' as UserRole, icon: Store, title: 'Seller', subtitle: 'Receive targeted part requests, manage a shop, list inventory.' },
            ].map(({ type, icon: Icon, title, subtitle }) => (
              <button key={type} onClick={() => setEditRole(type)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${editRole === type ? 'border-teal bg-teal-wash' : 'border-teal-border hover:border-teal/40'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${editRole === type ? 'bg-teal text-white' : 'bg-teal-wash text-muted'}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-dark">{title}</h3>
                      {editRole === type && <CheckCircle size={14} className="text-teal" />}
                    </div>
                    <p className="text-sm text-muted">{subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setView('main')} className="btn-secondary px-6">Cancel</button>
            <button onClick={() => { setRole(editRole); setView('main'); }} className="btn-primary flex-1 justify-center">
              <CheckCircle size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Dashboard ── */
  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Good morning,</p>
            <h1 className="text-xl font-black text-white">Giorgi Beridze</h1>
            <span className={`inline-flex items-center gap-1.5 mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${role === 'buyer' ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
              {role === 'buyer' ? <><ShoppingBag size={11} /> Buyer</> : <><Store size={11} /> Seller</>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('edit-profile')} className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors">
              <Edit3 size={16} />
            </button>
            <Link href="/request" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-bold rounded-xl transition-all">
              <Plus size={16} /> New Request
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Seller: Create Shop banner */}
        {role === 'seller' && !shopCreated && (
          <div className="mb-8 rounded-2xl border-2 border-dashed border-teal-border bg-teal-wash p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
              <Store size={28} className="text-teal" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-black text-dark text-lg mb-1">Create Your Shop</h3>
              <p className="text-muted text-sm">You&apos;re registered as a Seller. Set up your public storefront so buyers can find and contact you.</p>
            </div>
            <button onClick={() => setView('create-shop')} className="btn-primary shrink-0 whitespace-nowrap">
              <Store size={16} /> Create Shop <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Seller: Shop created success */}
        {role === 'seller' && shopCreated && (
          <div className="mb-8 rounded-2xl bg-teal/5 border border-teal/20 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-dark">Your shop is live!</p>
              <p className="text-sm text-muted">Buyers can now find your shop and send requests.</p>
            </div>
            <Link href="/dashboard/shop" className="btn-teal py-2.5 px-5 text-sm">
              Manage Shop
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(role === 'buyer'
            ? [
                { label: 'Active Requests', value: '2', color: 'text-teal' },
                { label: 'Offers Received', value: '5', color: 'text-teal-dark' },
                { label: 'Orders', value: '8', color: 'text-dark' },
                { label: 'Total Spent', value: '₾1,240', color: 'text-teal' },
              ]
            : [
                { label: 'New Requests', value: '12', color: 'text-teal' },
                { label: 'Active Orders', value: '4', color: 'text-teal-dark' },
                { label: 'Total Sales', value: '₾3,840', color: 'text-dark' },
                { label: 'Rating', value: '4.8★', color: 'text-yellow' },
              ]
          ).map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Role switcher quick access */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-teal-wash border border-teal-border rounded-xl p-1 w-fit">
            {(['requests', 'offers', 'orders'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all capitalize ${tab === t ? 'bg-teal text-white' : 'text-muted hover:text-dark'}`}>
                {t}
              </button>
            ))}
          </div>
          {role === 'seller' && (
            <Link href="/dashboard/supplier" className="flex items-center gap-1.5 text-sm font-bold text-teal hover:text-teal-dark transition-colors">
              <Users size={14} /> Seller Dashboard <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {tab === 'requests' && (
          <div className="space-y-3">
            {requests.map((r) => {
              const sc = statusConfig[r.status as keyof typeof statusConfig];
              const Icon = sc.icon;
              return (
                <div key={r.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-dark truncate">{r.part}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${sc.color}`}>
                        <Icon size={10} /> {sc.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{r.vehicle} · {r.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {r.offerCount > 0 && (
                      <span className="text-sm font-bold text-teal bg-teal/10 border border-teal/20 px-3 py-1.5 rounded-lg">
                        {r.offerCount} offers
                      </span>
                    )}
                    <Link href={`/requests/${r.id}`} className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-dark transition-colors">
                      View <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'offers' && (
          <div className="space-y-3">
            <p className="text-sm text-muted mb-2">Offers for: <strong className="text-dark">BMW E46 Front Bumper</strong></p>
            {offers.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-dark">{o.shop}</h3>
                    <StarRating rating={o.rating} size={12} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <span>Condition: <strong className="text-dark">{o.condition}</strong></span>
                    <span>Delivery: <strong className="text-dark">{o.delivery}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-teal">₾{o.price}</span>
                  <button className="btn-primary py-2.5 px-5 text-sm">Accept</button>
                  <button className="flex items-center gap-1 p-2.5 border-2 border-teal-border rounded-lg hover:border-teal text-muted hover:text-teal transition-colors">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-dark mb-0.5">{o.part}</h3>
                  <p className="text-sm text-muted">{o.shop} · {o.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-teal">₾{o.price}</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${o.status === 'delivered' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-yellow/15 text-dark border-yellow/25'}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
