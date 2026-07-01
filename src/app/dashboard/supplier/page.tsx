'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageCircle, CheckCircle, DollarSign, Send, Package,
  ChevronLeft, AlertCircle, Plus, X, Car, Settings, ChevronDown, Tag,
} from 'lucide-react';
import { getUser, requestsApi, ordersApi, shopsApi } from '@/lib/api';

type Tab = 'requests' | 'quotes' | 'orders' | 'setup';

const reqStatusConfig: Record<string, { label: string; color: string; dot: string }> = {
  open:      { label: 'New',       color: 'bg-teal/10 text-teal border-teal/20',         dot: 'bg-teal' },
  offered:   { label: 'Quoted',    color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  fulfilled: { label: 'Fulfilled', color: 'bg-teal/10 text-teal border-teal/20',         dot: 'bg-teal' },
  closed:    { label: 'Closed',    color: 'bg-slate-50 text-slate-400 border-slate-200', dot: 'bg-slate-400' },
};

const orderStatusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'bg-yellow/15 text-dark border-yellow/25' },
  accepted:  { label: 'Accepted',  color: 'bg-teal/10 text-teal border-teal/20' },
  paid:      { label: 'Paid',      color: 'bg-teal/10 text-teal border-teal/20' },
  completed: { label: 'Delivered', color: 'bg-teal/10 text-teal border-teal/20' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-500 border-red-100' },
};

function QuoteModal({ request, onClose, onSent }: { request: any; onClose: () => void; onSent: () => void }) {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [condition, setCondition] = useState('used');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');

  const handleSend = async () => {
    if (!price) return;
    setSending(true); setErr('');
    try {
      await requestsApi.makeOffer(request.id, {
        price: Number(price),
        description: description || `Available part for ${request.brand?.name || ''} ${request.model?.name || ''}`,
        part_number: partNumber || undefined,
        condition,
        delivery_days: deliveryDays || undefined,
      });
      onSent();
      onClose();
    } catch (e: any) {
      setErr(e.message || 'Failed to send offer');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-7 card-shadow border border-teal-border">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-black text-dark text-lg">{request.brand?.name} {request.model?.name}</h3>
            <p className="text-sm text-muted">{request.category?.name}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-dark transition-colors p-1 text-xl leading-none">×</button>
        </div>
        <div className="bg-teal-wash rounded-xl p-4 mb-5 text-sm text-muted border border-teal-border">
          <strong className="text-dark">Customer request: </strong>{request.description}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Your Price (₾) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0" className="input-base" min="0" />
            </div>
            <div>
              <label className="field-label">Part Number</label>
              <input value={partNumber} onChange={(e) => setPartNumber(e.target.value)}
                placeholder="Optional" className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Condition *</label>
              <div className="input-wrap">
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className="bg-white appearance-none">
                  <option value="new">New</option>
                  <option value="used">Used (Good)</option>
                  <option value="refurbished">Refurbished</option>
                </select>
                <span className="input-end"><ChevronDown size={13} /></span>
              </div>
            </div>
            <div>
              <label className="field-label">Delivery (days)</label>
              <input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)}
                placeholder="e.g. 1-3" className="input-base" />
            </div>
          </div>
          <div>
            <label className="field-label">Description / Note</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2} placeholder="Compatibility, warranty, any details..." className="input-base resize-none" />
          </div>
          {err && <p className="text-sm text-red-500 font-semibold">{err}</p>}
          <button onClick={handleSend} disabled={!price || sending}
            className="btn-primary w-full py-3.5 justify-center rounded-xl disabled:opacity-50">
            {sending ? <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" /> : <><Send size={16} /> Send Quote</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Setup Tab: shop creation + specializations ── */
function SetupTab({ user }: { user: any }) {
  const [shop, setShop] = useState<any>(null);
  const [specs, setSpecs] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selBrand, setSelBrand] = useState('');
  const [selModel, setSelModel] = useState('');
  const [addingSpec, setAddingSpec] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [specErr, setSpecErr] = useState('');

  /* Categories */
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [savingCats, setSavingCats] = useState(false);
  const [catsMsg, setCatsMsg] = useState('');

  /* Shop form */
  const [shopForm, setShopForm] = useState({ name: '', description: '', city: '', phone: '', address: '' });
  const [savingShop, setSavingShop] = useState(false);
  const [shopMsg, setShopMsg] = useState('');

  const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi'];

  const loadAll = useCallback(async () => {
    const [sh, sp, br, cats] = await Promise.all([
      shopsApi.myShop().catch(() => null),
      shopsApi.getSpecializations().catch(() => []),
      shopsApi.brands().catch(() => []),
      shopsApi.categories().catch(() => []),
    ]);
    setShop(sh);
    setSpecs(sp);
    setBrands(br);
    setAllCategories(cats);
    if (sh) {
      setShopForm({ name: sh.name || '', description: sh.description || '', city: sh.city || '', phone: sh.phone || '', address: sh.address || '' });
      setSelectedCats((sh.categories || []).map((c: any) => c.id));
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (!selBrand) { setModels([]); setSelModel(''); return; }
    shopsApi.modelsByBrand(Number(selBrand)).then(setModels).catch(() => []);
    setSelModel('');
  }, [selBrand]);

  const saveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingShop(true); setShopMsg('');
    try {
      if (shop) {
        await shopsApi.update(shopForm);
      } else {
        await shopsApi.create(shopForm);
      }
      setShopMsg('Saved!');
      loadAll();
    } catch (err: any) {
      setShopMsg(err.message || 'Failed');
    } finally {
      setSavingShop(false);
      setTimeout(() => setShopMsg(''), 3000);
    }
  };

  const addSpec = async () => {
    if (!selBrand) return;
    setAddingSpec(true); setSpecErr('');
    try {
      await shopsApi.addSpecialization({ brand_id: Number(selBrand), model_id: selModel ? Number(selModel) : undefined });
      setSelBrand(''); setSelModel('');
      loadAll();
    } catch (err: any) {
      setSpecErr(err.message || 'Failed');
    } finally {
      setAddingSpec(false);
    }
  };

  const removeSpec = async (id: number) => {
    setRemovingId(id);
    try { await shopsApi.removeSpecialization(id); loadAll(); }
    finally { setRemovingId(null); }
  };

  const toggleCat = (id: number) => setSelectedCats(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const saveCats = async () => {
    if (!shop) return;
    setSavingCats(true); setCatsMsg('');
    try {
      await shopsApi.setCategories(selectedCats);
      setCatsMsg('Saved!');
    } catch (e: any) {
      setCatsMsg(e.message || 'Failed');
    } finally {
      setSavingCats(false);
      setTimeout(() => setCatsMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Specializations — most important section */}
      <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center shrink-0">
            <Car size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-dark">Car Brand Specializations</h3>
            <p className="text-sm text-muted mt-0.5">
              Add the car brands you specialize in. <strong className="text-dark">Customers requesting parts for these brands will send you notifications.</strong>
            </p>
          </div>
        </div>

        {/* Current specializations */}
        {specs.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-5">
            {specs.map((s) => (
              <div key={s.id}
                className="flex items-center gap-2 px-3 py-2 bg-teal-wash border border-teal-border rounded-xl text-sm font-semibold text-dark">
                <Car size={13} className="text-teal" />
                <span>{s.brand?.name || `Brand #${s.brand_id}`}</span>
                {s.model && <span className="text-muted">· {s.model.name}</span>}
                <button onClick={() => removeSpec(s.id)} disabled={removingId === s.id}
                  className="ml-1 text-muted hover:text-red-500 transition-colors disabled:opacity-50">
                  {removingId === s.id
                    ? <span className="w-3 h-3 border border-muted border-t-red-400 rounded-full animate-spin inline-block" />
                    : <X size={13} />
                  }
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-dark">No specializations added yet</p>
              <p className="text-muted">Add car brands below to start receiving requests from matching customers.</p>
            </div>
          </div>
        )}

        {/* Add new */}
        <div className="border border-teal-border rounded-xl p-4 bg-teal-wash/50">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Add Brand / Model</p>
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <div className="input-wrap">
                <select value={selBrand} onChange={(e) => setSelBrand(e.target.value)}
                  className="bg-white appearance-none">
                  <option value="">Select brand *</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <span className="input-end"><ChevronDown size={13} /></span>
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <div className="input-wrap">
                <select value={selModel} onChange={(e) => setSelModel(e.target.value)}
                  disabled={!selBrand || models.length === 0}
                  className="bg-white appearance-none disabled:opacity-50">
                  <option value="">All models (optional)</option>
                  {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <span className="input-end"><ChevronDown size={13} /></span>
              </div>
            </div>
            <button onClick={addSpec} disabled={!selBrand || addingSpec}
              className="btn-teal px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              {addingSpec
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Plus size={15} /> Add</>
              }
            </button>
          </div>
          {specErr && <p className="text-sm text-red-500 font-semibold mt-2">{specErr}</p>}
        </div>
      </div>

      {/* Part Categories */}
      {allCategories.filter(c => !c.parent_id).length > 0 && (
        <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
              <Tag size={20} className="text-teal" />
            </div>
            <div>
              <h3 className="font-black text-dark">Part Categories</h3>
              <p className="text-sm text-muted mt-0.5">Select the part categories you sell. Customers can filter by category.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {allCategories.filter(c => !c.parent_id).map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCat(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all ${selectedCats.includes(cat.id) ? 'bg-teal text-white border-teal' : 'bg-white text-muted border-teal-border hover:border-teal hover:text-dark'}`}>
                {selectedCats.includes(cat.id) && <CheckCircle size={13} />}
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={saveCats} disabled={savingCats || !shop}
              className="btn-teal px-6 disabled:opacity-50">
              {savingCats ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Categories'}
            </button>
            {!shop && <span className="text-xs text-muted">Create your shop first</span>}
            {catsMsg && (
              <span className={`text-sm font-semibold ${catsMsg === 'Saved!' ? 'text-teal' : 'text-red-500'}`}>{catsMsg}</span>
            )}
          </div>
        </div>
      )}

      {/* Shop info */}
      <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
            <Settings size={20} className="text-teal" />
          </div>
          <div>
            <h3 className="font-black text-dark">{shop ? 'Edit Shop' : 'Create Your Shop'}</h3>
            <p className="text-sm text-muted mt-0.5">Your public storefront visible to all buyers</p>
          </div>
        </div>
        <form onSubmit={saveShop} className="space-y-4">
          <div>
            <label className="field-label">Shop Name *</label>
            <div className="input-wrap">
              <input value={shopForm.name} onChange={(e) => setShopForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. AutoParts Tbilisi" required />
            </div>
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea value={shopForm.description}
              onChange={(e) => setShopForm(p => ({ ...p, description: e.target.value }))}
              placeholder="What do you specialize in?" rows={2} className="input-base resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">City *</label>
              <div className="input-wrap">
                <select value={shopForm.city} onChange={(e) => setShopForm(p => ({ ...p, city: e.target.value }))}
                  className="bg-white appearance-none" required>
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <span className="input-end"><ChevronDown size={13} /></span>
              </div>
            </div>
            <div>
              <label className="field-label">Phone *</label>
              <div className="input-wrap">
                <input type="tel" value={shopForm.phone}
                  onChange={(e) => setShopForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+995 5XX XXX XXX" required />
              </div>
            </div>
          </div>
          <div>
            <label className="field-label">Address</label>
            <div className="input-wrap">
              <input value={shopForm.address}
                onChange={(e) => setShopForm(p => ({ ...p, address: e.target.value }))}
                placeholder="Street address" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={savingShop || !shopForm.name || !shopForm.city || !shopForm.phone}
              className="btn-teal px-8 disabled:opacity-50">
              {savingShop
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : shop ? 'Save Changes' : 'Create Shop'
              }
            </button>
            {shopMsg && (
              <span className={`text-sm font-semibold ${shopMsg === 'Saved!' ? 'text-teal' : 'text-red-500'}`}>
                {shopMsg}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<Tab>('setup');
  const [requests, setRequests] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotingRequest, setQuotingRequest] = useState<any>(null);
  const [accepting, setAccepting] = useState<number | null>(null);

  const loadData = async () => {
    const [reqs, ords] = await Promise.all([
      requestsApi.incoming().catch(() => []),
      ordersApi.sellerOrders().catch(() => []),
    ]);
    setRequests(reqs);
    setOrders(ords);
  };

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    if (u.role !== 'seller') { router.push('/dashboard'); return; }
    setUser(u);
    loadData().finally(() => setLoading(false));
  }, [router]);

  const handleAcceptOrder = async (orderId: number) => {
    setAccepting(orderId);
    try {
      await ordersApi.acceptOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o));
    } finally {
      setAccepting(null);
    }
  };

  if (!user) return null;

  const newCount = requests.filter(r => r.status === 'open').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((s: number, o: any) => s + Number(o.total || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      {quotingRequest && (
        <QuoteModal
          request={quotingRequest}
          onClose={() => setQuotingRequest(null)}
          onSent={() => loadData()}
        />
      )}

      <div className="gradient-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <div>
              <p className="text-white/60 text-xs">Seller Panel</p>
              <h1 className="text-lg font-black text-white">{user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {newCount > 0 && (
              <span className="flex items-center gap-2 px-4 py-2 bg-white/15 text-white border border-white/20 rounded-xl text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-yellow animate-pulse" />
                {newCount} new request{newCount > 1 ? 's' : ''}
              </span>
            )}
            {pendingOrders > 0 && (
              <span className="flex items-center gap-2 px-3 py-2 bg-white/15 text-white border border-white/20 rounded-xl text-sm font-bold">
                <Package size={13} />
                {pendingOrders} order{pendingOrders > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'New Requests',   value: String(newCount),    color: 'text-teal',      icon: MessageCircle },
            { label: 'Pending Orders', value: String(pendingOrders), color: 'text-dark',    icon: Package },
            { label: 'Completed',      value: String(orders.filter(o => o.status === 'completed').length), color: 'text-teal-dark', icon: CheckCircle },
            { label: 'Revenue',        value: `₾${totalRevenue.toFixed(0)}`, color: 'text-teal', icon: DollarSign },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <Icon size={18} className={`${color} opacity-60 mb-2`} />
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-teal-wash border border-teal-border rounded-xl p-1 mb-6 w-fit">
          {(['setup', 'requests', 'quotes', 'orders'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${tab === t ? 'bg-teal text-white' : 'text-muted hover:text-dark'}`}>
              {t === 'requests' && newCount > 0 && <span className="w-2 h-2 rounded-full bg-yellow" />}
              {t === 'orders' && pendingOrders > 0 && <span className="w-2 h-2 rounded-full bg-yellow" />}
              {t === 'setup' ? 'Setup / Brands' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Setup Tab */}
        {tab === 'setup' && <SetupTab user={user} />}

        {/* Data tabs */}
        {tab !== 'setup' && loading ? (
          <div className="flex justify-center py-12">
            <span className="w-7 h-7 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Requests Tab */}
            {tab === 'requests' && (
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="text-center py-16 text-muted">
                    <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold text-dark mb-1">No matching requests yet</p>
                    <p className="text-sm mb-4">Add car brands in the <strong>Setup / Brands</strong> tab to start receiving customer requests.</p>
                    <button onClick={() => setTab('setup')} className="btn-teal">Go to Setup</button>
                  </div>
                ) : (
                  requests.map((r) => {
                    const sc = reqStatusConfig[r.status] || reqStatusConfig.open;
                    return (
                      <div key={r.id} className={`bg-white rounded-2xl p-5 card-shadow border border-l-4 ${r.status === 'open' ? 'border-teal-border border-l-teal' : r.status === 'offered' ? 'border-teal-border border-l-amber-400' : 'border-teal-border border-l-slate-300'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-bold text-dark">
                                {r.brand?.name} {r.model?.name} {r.year && `(${r.year})`}
                              </h3>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${sc.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                              </span>
                              {r.category?.name && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-wash border border-teal-border text-muted">
                                  {r.category.name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted mb-2">
                              {r.customer?.name} · {r.customer?.city || 'Unknown city'} · {new Date(r.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted bg-teal-wash border border-teal-border rounded-lg px-3 py-2">
                              {r.description}
                            </p>
                          </div>
                          {r.status === 'open' && (
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => setQuotingRequest(r)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal text-white text-sm font-bold rounded-xl hover:bg-teal-dark transition-colors">
                                <Send size={14} /> Quote
                              </button>
                            </div>
                          )}
                          {r.status === 'offered' && (
                            <div className="shrink-0 text-sm text-muted font-semibold px-3 py-1.5 bg-teal-wash border border-teal-border rounded-lg">
                              {r.offers?.length || 0} offer(s) sent
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Quotes Tab */}
            {tab === 'quotes' && (
              <div className="space-y-3">
                {requests.filter(r => (r.offers?.length || 0) > 0).length === 0 ? (
                  <div className="text-center py-16 text-muted">
                    <Send size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold text-dark mb-1">No quotes sent yet</p>
                    <p className="text-sm">Send quotes from the Requests tab to see them here.</p>
                  </div>
                ) : (
                  requests.filter(r => (r.offers?.length || 0) > 0).flatMap((r) =>
                    (r.offers || []).map((offer: any) => (
                      <div key={offer.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-dark">{r.brand?.name} {r.model?.name}</h3>
                          <p className="text-sm text-muted">Customer: {r.customer?.name} · {new Date(offer.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-black text-teal">₾{Number(offer.price).toFixed(0)}</span>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${offer.status === 'accepted' ? 'bg-teal/10 text-teal border-teal/20' : offer.status === 'rejected' ? 'bg-red-50 text-red-400 border-red-100' : 'bg-yellow/15 text-dark border-yellow/25'}`}>
                            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="text-center py-16 text-muted">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold text-dark mb-1">No orders yet</p>
                    <p className="text-sm">Orders from buyers will appear here once they purchase your parts.</p>
                  </div>
                ) : (
                  orders.map((o) => {
                    const sc = orderStatusConfig[o.status] || orderStatusConfig.pending;
                    return (
                      <div key={o.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-bold text-dark">Order #{o.id}</h3>
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sc.color}`}>{sc.label}</span>
                            </div>
                            <p className="text-sm text-muted">
                              {o.customer?.name || 'Customer'} · {o.delivery_city} · {o.items?.length || 0} item(s) · {new Date(o.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-teal">₾{Number(o.total).toFixed(0)}</span>
                            {o.status === 'pending' && (
                              <button onClick={() => handleAcceptOrder(o.id)} disabled={accepting === o.id}
                                className="btn-teal py-2 px-4 text-sm disabled:opacity-60">
                                {accepting === o.id
                                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  : <><CheckCircle size={14} /> Accept</>
                                }
                              </button>
                            )}
                            {o.status === 'accepted' && (
                              <span className="text-xs font-semibold px-3 py-1.5 bg-teal-wash border border-teal-border rounded-lg text-muted">
                                Awaiting delivery confirmation
                              </span>
                            )}
                            {o.status === 'completed' && (
                              <span className="text-xs font-semibold px-3 py-1.5 bg-teal/10 border border-teal/20 rounded-lg text-teal">
                                Payment Released ✓
                              </span>
                            )}
                          </div>
                        </div>
                        {o.status === 'pending' && (
                          <div className="mt-3 flex items-start gap-2 bg-teal-wash border border-teal/20 rounded-xl p-3 text-sm text-muted">
                            <AlertCircle size={14} className="text-teal mt-0.5 shrink-0" />
                            <span>Accept to confirm you will ship. Payment is held until buyer confirms delivery.</span>
                          </div>
                        )}
                        {(o.items || []).length > 0 && (
                          <div className="mt-3 space-y-1">
                            {o.items.map((item: any) => (
                              <div key={item.id} className="flex items-center justify-between text-sm text-muted bg-teal-wash rounded-lg px-3 py-2">
                                <span className="font-semibold text-dark">{item.part?.name || 'Part'}</span>
                                <span>×{item.quantity} · ₾{Number(item.price).toFixed(0)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
