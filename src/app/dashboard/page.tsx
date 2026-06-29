'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Plus, Bell, MessageCircle } from 'lucide-react';
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
  pending: { label: 'Waiting', color: 'bg-amber/15 text-dark border-amber/25', icon: Clock },
  completed: { label: 'Completed', color: 'bg-teal/10 text-teal border-teal/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-500 border-red-100', icon: XCircle },
};

type Tab = 'requests' | 'offers' | 'orders';

export default function CustomerDashboard() {
  const [tab, setTab] = useState<Tab>('requests');

  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Good morning,</p>
            <h1 className="text-xl font-black text-white">Giorgi Beridze</h1>
          </div>
          <Link href="/request" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-bold rounded-xl transition-all">
            <Plus size={16} /> New Request
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Requests', value: '2', color: 'text-teal' },
            { label: 'Offers Received', value: '5', color: 'text-teal-dark' },
            { label: 'Orders', value: '8', color: 'text-dark' },
            { label: 'Total Spent', value: '₾1,240', color: 'text-teal' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-teal-wash border border-teal-border rounded-xl p-1 mb-6 w-fit">
          {(['requests', 'offers', 'orders'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all capitalize ${tab === t ? 'bg-teal text-white' : 'text-muted hover:text-dark'}`}>
              {t}
            </button>
          ))}
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
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${o.status === 'delivered' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-amber/15 text-dark border-amber/25'}`}>
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
