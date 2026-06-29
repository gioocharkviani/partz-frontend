'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Plus, Package, TrendingUp, Star, MessageCircle, Upload, X, Eye, Edit2, Trash2, CheckCircle, Camera } from 'lucide-react';
import StarRating from '@/components/StarRating';

const existingProducts = [
  { id: 1, name: 'BMW E46 Front Bumper OEM', price: 320, category: 'Body & Exterior', condition: 'used', stock: 1, views: 142 },
  { id: 2, name: 'Bosch Alternator 120A', price: 185, category: 'Electrical', condition: 'new', stock: 3, views: 87 },
  { id: 3, name: 'Mercedes W211 Headlight R', price: 240, category: 'Lighting', condition: 'refurbished', stock: 1, views: 201 },
  { id: 4, name: 'VW Golf 5 Gearbox ECU', price: 150, category: 'Electrical', condition: 'used', stock: 2, views: 56 },
];

const recentRequests = [
  { id: 1, part: 'Timing Belt Kit Ford Focus', vehicle: 'Ford Focus 2.0 2008', customer: 'David B.', time: '10 min ago' },
  { id: 2, part: 'Brake Pads Toyota Corolla', vehicle: 'Toyota Corolla 2015', customer: 'Nino K.', time: '1h ago' },
  { id: 3, part: 'Air Mass Sensor BMW E90', vehicle: 'BMW 318d 2008', customer: 'Giorgi M.', time: '3h ago' },
];

const CATEGORIES = ['Engine', 'Body & Exterior', 'Brakes', 'Suspension', 'Electrical', 'Lighting', 'Transmission', 'Filters', 'Tyres'];
const CONDITIONS = ['new', 'used', 'refurbished'];

type View = 'overview' | 'add-product' | 'products';

export default function ShopDashboard() {
  const [view, setView] = useState<View>('overview');

  // Add product form state
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pCondition, setPCondition] = useState('new');
  const [pStock, setPStock] = useState('1');
  const [pBrand, setPBrand] = useState('');
  const [pModel, setPModel] = useState('');
  const [pYear, setPYear] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pImages, setPImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).slice(0, 6 - pImages.length).map((f) => URL.createObjectURL(f));
    setPImages((prev) => [...prev, ...urls]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setView('products'); }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <div className="gradient-teal py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs">Shop Dashboard</p>
            <h1 className="text-lg font-black text-white">AutoParts Tbilisi</h1>
          </div>
          <div className="flex gap-2">
            {(['overview', 'products', 'add-product'] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${view === v ? 'bg-teal text-white' : 'text-white/60 hover:text-white'}`}>
                {v === 'add-product' ? '+ Add Part' : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* OVERVIEW */}
        {view === 'overview' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Products', value: '1,840', color: 'text-dark', icon: Package },
                { label: 'Monthly Views', value: '8,420', color: 'text-teal', icon: TrendingUp },
                { label: 'Rating', value: '4.8', color: 'text-teal', icon: Star },
                { label: 'New Requests', value: '12', color: 'text-teal-dark', icon: MessageCircle },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-5 card-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={18} className={`${color} opacity-60`} />
                  </div>
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-xs text-muted mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent requests */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-black text-dark">Part Requests</h2>
                  <span className="text-xs font-bold text-white bg-teal px-2 py-0.5 rounded-full">{recentRequests.length} new</span>
                </div>
                <div className="space-y-4">
                  {recentRequests.map((r) => (
                    <div key={r.id} className="flex items-start gap-3 pb-4 border-b border-teal-border last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-xl bg-teal-wash flex items-center justify-center shrink-0 text-dark font-bold text-sm">
                        {r.customer.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-dark truncate">{r.part}</p>
                        <p className="text-xs text-muted">{r.vehicle}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-xs text-subtle">{r.time}</span>
                        <button className="text-xs font-bold text-white bg-teal px-2.5 py-1 rounded-lg hover:bg-teal-dark transition-colors">
                          Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top products */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-black text-dark">Top Products</h2>
                  <button onClick={() => setView('products')} className="text-xs font-bold text-teal">View all</button>
                </div>
                <div className="space-y-3">
                  {existingProducts.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-wash transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-teal-wash flex items-center justify-center text-lg shrink-0">âš™ï¸</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-dark truncate">{p.name}</p>
                        <p className="text-xs text-muted">{p.views} views Â· Stock: {p.stock}</p>
                      </div>
                      <span className="text-sm font-black text-teal shrink-0">â‚¾{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS LIST */}
        {view === 'products' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-dark">My Products</h2>
              <button onClick={() => setView('add-product')} className="btn-primary py-2.5">
                <Plus size={16} /> Add Part
              </button>
            </div>
            <div className="bg-white rounded-2xl card-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-teal-wash">
                      <th className="px-5 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Product</th>
                      <th className="px-5 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Category</th>
                      <th className="px-5 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Condition</th>
                      <th className="px-5 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">Price</th>
                      <th className="px-5 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">Stock</th>
                      <th className="px-5 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">Views</th>
                      <th className="px-5 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-border">
                    {existingProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-teal-wash/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-dark text-sm">{p.name}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted">{p.category}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.condition === 'new' ? 'bg-teal/10 text-teal' : p.condition === 'used' ? 'bg-teal/10 text-teal' : 'bg-teal/10 text-dark'}`}>
                            {p.condition}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-black text-teal">â‚¾{p.price}</td>
                        <td className="px-5 py-4 text-right text-sm text-muted">{p.stock}</td>
                        <td className="px-5 py-4 text-right text-sm text-muted">{p.views}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1.5">
                            <button className="p-1.5 text-subtle hover:text-teal hover:bg-teal/10 rounded-lg transition-colors"><Eye size={15} /></button>
                            <button className="p-1.5 text-subtle hover:text-dark hover:bg-teal-wash-dark rounded-lg transition-colors"><Edit2 size={15} /></button>
                            <button className="p-1.5 text-subtle hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ADD PRODUCT */}
        {view === 'add-product' && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('products')} className="text-muted hover:text-dark text-sm">â† Back</button>
              <h2 className="text-xl font-black text-dark">Add New Part</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic info */}
              <div className="bg-white rounded-2xl p-6 card-shadow space-y-5">
                <h3 className="font-black text-dark text-sm uppercase tracking-wider">Product Details</h3>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Part Name *</label>
                  <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="e.g. BMW E46 Front Bumper OEM" required className="input-base" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Category *</label>
                    <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} required className="input-base bg-white appearance-none">
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Condition *</label>
                    <div className="flex gap-2">
                      {CONDITIONS.map((c) => (
                        <button key={c} type="button" onClick={() => setPCondition(c)}
                          className={`flex-1 py-2.5 text-xs font-bold rounded-lg border-2 transition-all capitalize ${pCondition === c ? 'bg-teal text-white border-teal' : 'border-teal-border text-muted hover:border-teal'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Price (â‚¾) *</label>
                    <input type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="0" min="0" required className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Stock Quantity</label>
                    <input type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} min="0" className="input-base" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} rows={3} placeholder="Condition details, notes, part number..." className="input-base resize-none" />
                </div>
              </div>

              {/* Compatibility */}
              <div className="bg-white rounded-2xl p-6 card-shadow space-y-5">
                <h3 className="font-black text-dark text-sm uppercase tracking-wider">Vehicle Compatibility</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Brand</label>
                    <input value={pBrand} onChange={(e) => setPBrand(e.target.value)} placeholder="BMW, VW..." className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Model</label>
                    <input value={pModel} onChange={(e) => setPModel(e.target.value)} placeholder="3 Series, Golf" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Year</label>
                    <input value={pYear} onChange={(e) => setPYear(e.target.value)} placeholder="2003-2006" className="input-base" />
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
                <h3 className="font-black text-dark text-sm uppercase tracking-wider">Photos</h3>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImages(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver ? 'border-teal bg-teal/5' : 'border-teal-border hover:border-teal/50 hover:bg-teal-wash/50'}`}
                >
                  <Camera size={28} className="mx-auto mb-2 text-dark/30" />
                  <p className="text-sm font-medium text-muted">Drop product photos or <span className="text-teal font-bold">click to upload</span></p>
                  <p className="text-xs text-dark/30 mt-0.5">Max 6 photos Â· PNG, JPG up to 10MB</p>
                  <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleImages(e.target.files)} />
                </div>

                {pImages.length > 0 && (
                  <div className="flex gap-3 flex-wrap">
                    {pImages.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border-2 border-teal-border" />
                        <button type="button" onClick={() => setPImages((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-teal text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button type="submit" disabled={saving || saved} className="btn-primary flex-1 py-4 justify-center text-base rounded-xl">
                  {saving ? <span className="w-5 h-5 border-2 border-teal/30 border-t-teal rounded-full animate-spin" /> :
                    saved ? <><CheckCircle size={18} /> Saved!</> :
                    <><Plus size={18} /> Add Product</>}
                </button>
                <button type="button" onClick={() => setView('overview')} className="px-6 py-4 border-2 border-teal-border rounded-xl text-sm font-bold text-muted hover:border-teal hover:text-dark transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}



