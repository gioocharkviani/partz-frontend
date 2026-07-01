'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Clock, CheckCircle, Package, Star, Truck, Tag,
  AlertCircle, MapPin, Phone, X,
} from 'lucide-react';
import { getUser, requestsApi } from '@/lib/api';

const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi', 'Akhaltsikhe', 'Ozurgeti'];

const conditionLabel: Record<string, string> = {
  new: 'New',
  used: 'Used',
  refurbished: 'Refurbished',
};
const conditionColor: Record<string, string> = {
  new: 'bg-teal/10 text-teal border-teal/20',
  used: 'bg-amber-50 text-amber-700 border-amber-200',
  refurbished: 'bg-blue-50 text-blue-600 border-blue-200',
};

interface DeliveryForm {
  delivery_address: string;
  delivery_city: string;
  phone: string;
}

function AcceptModal({
  offer,
  requestId,
  onClose,
  onAccepted,
}: {
  offer: any;
  requestId: number;
  onClose: () => void;
  onAccepted: (orderId: number) => void;
}) {
  const [form, setForm] = useState<DeliveryForm>({ delivery_address: '', delivery_city: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof DeliveryForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleAccept = async () => {
    setErr(''); setSubmitting(true);
    try {
      const res = await requestsApi.acceptOffer(requestId, offer.id, {
        delivery_address: form.delivery_address,
        delivery_city: form.delivery_city,
        phone: form.phone,
        payment_method: 'cash',
      });
      onAccepted(res.orderId);
    } catch (e: any) {
      setErr(e.message || 'Failed to accept offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md card-shadow border border-teal-border">
        <div className="flex items-center justify-between p-6 border-b border-teal-border">
          <h3 className="font-black text-dark text-lg">Accept Offer</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-teal-wash transition-colors text-muted hover:text-dark">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Offer summary */}
          <div className="bg-teal-wash border border-teal-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-dark">{offer.shop?.name || 'Seller'}</span>
              <span className="text-2xl font-black text-teal">₾{Number(offer.price).toFixed(0)}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {offer.condition && (
                <span className={`px-2 py-0.5 rounded-full border font-semibold ${conditionColor[offer.condition] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {conditionLabel[offer.condition] || offer.condition}
                </span>
              )}
              {offer.delivery_days && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200 font-semibold">
                  <Truck size={10} /> {offer.delivery_days} days
                </span>
              )}
            </div>
            {offer.description && (
              <p className="text-sm text-muted mt-2">{offer.description}</p>
            )}
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>Payment will be <strong>held by partz.ge</strong> until you confirm delivery. Release it only after you receive and verify the part.</span>
          </div>

          {/* Delivery form */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-dark">Delivery Details</p>
            <div>
              <label className="field-label">Delivery Address *</label>
              <div className="input-wrap">
                <span className="input-icon"><MapPin size={14} /></span>
                <input value={form.delivery_address} onChange={e => set('delivery_address', e.target.value)}
                  placeholder="Street, building, apartment" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">City *</label>
                <div className="input-wrap">
                  <select value={form.delivery_city} onChange={e => set('delivery_city', e.target.value)}
                    className="bg-white appearance-none" required>
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Phone *</label>
                <div className="input-wrap">
                  <span className="input-icon"><Phone size={14} /></span>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+995 5XX XXX XXX" required />
                </div>
              </div>
            </div>
          </div>

          {err && (
            <p className="text-sm text-red-500 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3">{err}</p>
          )}

          <button
            onClick={handleAccept}
            disabled={!form.delivery_address || !form.delivery_city || !form.phone || submitting}
            className="btn-teal w-full py-3.5 justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            {submitting
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><CheckCircle size={16} /> Confirm & Place Order</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [user, setUser] = useState<any>(null);
  const [request, setRequest] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOffer, setAcceptingOffer] = useState<any>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);

    Promise.all([
      requestsApi.myRequests(),
      requestsApi.getOffers(id),
    ])
      .then(([reqs, offs]) => {
        const req = reqs.find((r: any) => r.id === id);
        setRequest(req || null);
        setOffers(offs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, router]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted">
        <Package size={40} className="opacity-30" />
        <p className="font-bold text-dark">Request not found</p>
        <Link href="/dashboard" className="btn-teal">Back to Dashboard</Link>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="min-h-screen bg-teal-wash flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 card-shadow border border-teal-border text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-teal" />
          </div>
          <h2 className="text-2xl font-black text-dark mb-2">Order Created!</h2>
          <p className="text-muted mb-1">Your order has been placed and payment is held securely.</p>
          <p className="text-sm text-muted mb-8">Once the seller confirms shipment, you can confirm delivery and payment will be released.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard?tab=orders" className="btn-teal">View Orders</Link>
            <Link href="/dashboard" className="btn-secondary px-5">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const statusLabel: Record<string, string> = {
    open: 'Waiting for offers',
    offered: 'Offers received',
    fulfilled: 'Fulfilled',
    closed: 'Closed',
  };

  return (
    <div className="min-h-screen bg-white">
      {acceptingOffer && (
        <AcceptModal
          offer={acceptingOffer}
          requestId={id}
          onClose={() => setAcceptingOffer(null)}
          onAccepted={(oid) => { setAcceptingOffer(null); setOrderId(oid); }}
        />
      )}

      {/* Header */}
      <div className="gradient-teal py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <div>
              <p className="text-white/60 text-xs">Part Request</p>
              <h1 className="text-lg font-black text-white">
                {request.brand?.name} {request.model?.name} {request.year && `(${request.year})`}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Request card */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-black text-dark text-xl mb-1">
                {request.brand?.name} {request.model?.name} {request.year && `· ${request.year}`}
              </h2>
              {request.category?.name && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-wash border border-teal-border text-muted">
                  {request.category.name}
                </span>
              )}
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 ${request.status === 'offered' ? 'bg-teal/10 text-teal border-teal/20' : request.status === 'fulfilled' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-yellow/15 text-dark border-yellow/25'}`}>
              {statusLabel[request.status] || request.status}
            </span>
          </div>
          <p className="text-sm text-muted bg-teal-wash border border-teal-border rounded-xl p-4 leading-relaxed">
            {request.description}
          </p>
          <p className="text-xs text-muted mt-3 flex items-center gap-1">
            <Clock size={11} /> Submitted {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Offers */}
        <div>
          <h3 className="font-black text-dark text-lg mb-4">
            {offers.length === 0 ? 'No offers yet' : `${offers.length} Offer${offers.length > 1 ? 's' : ''} Received`}
          </h3>

          {offers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-teal-border text-muted">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold text-dark mb-1">Waiting for sellers</p>
              <p className="text-sm">Sellers matching your car brand will see your request and send offers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id}
                  className={`bg-white rounded-2xl p-6 card-shadow border-2 transition-all ${offer.status === 'accepted' ? 'border-teal' : offer.status === 'rejected' ? 'border-slate-100 opacity-60' : 'border-teal-border hover:border-teal/50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Shop / Seller info */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center shrink-0">
                          <span className="text-white text-sm font-black">{offer.shop?.name?.[0] || 'S'}</span>
                        </div>
                        <div>
                          <div className="font-black text-dark">{offer.shop?.name || 'Seller'}</div>
                          {offer.shop?.city && <div className="text-xs text-muted">{offer.shop.city}</div>}
                        </div>
                        {offer.status === 'accepted' && (
                          <span className="ml-auto flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">
                            <Star size={10} /> Accepted
                          </span>
                        )}
                        {offer.status === 'rejected' && (
                          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-200">
                            Rejected
                          </span>
                        )}
                      </div>

                      {/* Offer details */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {offer.condition && (
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${conditionColor[offer.condition] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            <Tag size={10} /> {conditionLabel[offer.condition] || offer.condition}
                          </span>
                        )}
                        {offer.delivery_days && (
                          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                            <Truck size={10} /> {offer.delivery_days} days delivery
                          </span>
                        )}
                        {offer.part_number && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                            PN: {offer.part_number}
                          </span>
                        )}
                      </div>

                      {offer.description && (
                        <p className="text-sm text-muted leading-relaxed">{offer.description}</p>
                      )}

                      <p className="text-xs text-muted mt-2">{new Date(offer.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Price + Action */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="text-3xl font-black text-teal">₾{Number(offer.price).toFixed(0)}</div>
                      {request.status !== 'fulfilled' && offer.status === 'pending' && (
                        <button
                          onClick={() => setAcceptingOffer(offer)}
                          className="btn-teal px-6 py-2.5 whitespace-nowrap">
                          <CheckCircle size={15} /> Accept Offer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
