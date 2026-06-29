'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Car, ShoppingBag, Store, Users, Check, ChevronRight, ChevronLeft,
  Search, Eye, EyeOff, MapPin, Phone, Mail, User, Building2, AlertCircle,
} from 'lucide-react';
import { CAR_BRANDS } from '@/lib/carData';
import { CATEGORIES } from '@/lib/categories';

type UserType = 'buyer' | 'seller' | null;
type SellerType = 'shop' | 'dealer' | null;

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  terms: boolean;
  sellerType: SellerType;
  businessName: string;
  businessAddress: string;
  selectedBrands: string[];
  brandModels: Record<string, string[]>;
  partConditions: ('new' | 'used')[];
  selectedCategories: string[];
  selectedSubcategories: Record<string, string[]>;
}

const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi', 'Akhaltsikhe', 'Ozurgeti'];
const TOTAL_SELLER_STEPS = 5;

function RegisterForm() {
  const searchParams = useSearchParams();
  const prefillRole = searchParams.get('role');

  const [userType, setUserType] = useState<UserType>(
    prefillRole === 'supplier' || prefillRole === 'shop' ? 'seller' : null,
  );
  const [sellerStep, setSellerStep] = useState(prefillRole === 'supplier' || prefillRole === 'shop' ? 2 : 1);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    city: '', terms: false,
    sellerType: prefillRole === 'shop' ? 'shop' : prefillRole === 'supplier' ? 'dealer' : null,
    businessName: '', businessAddress: '',
    selectedBrands: [],
    brandModels: {},
    partConditions: [],
    selectedCategories: [],
    selectedSubcategories: {},
  });

  const set = (k: keyof FormData, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const toggleBrand = (brandId: string) => {
    const cur = form.selectedBrands;
    if (cur.includes(brandId)) {
      const next = cur.filter((b) => b !== brandId);
      const models = { ...form.brandModels };
      delete models[brandId];
      setForm((p) => ({ ...p, selectedBrands: next, brandModels: models }));
    } else {
      setForm((p) => ({ ...p, selectedBrands: [...cur, brandId] }));
    }
  };

  const toggleModel = (brandId: string, model: string) => {
    const cur = form.brandModels[brandId] || [];
    const next = cur.includes(model) ? cur.filter((m) => m !== model) : [...cur, model];
    setForm((p) => ({ ...p, brandModels: { ...p.brandModels, [brandId]: next } }));
  };

  const toggleCategory = (catId: string) => {
    const cur = form.selectedCategories;
    if (cur.includes(catId)) {
      const subs = { ...form.selectedSubcategories };
      delete subs[catId];
      setForm((p) => ({ ...p, selectedCategories: cur.filter((c) => c !== catId), selectedSubcategories: subs }));
    } else {
      setForm((p) => ({ ...p, selectedCategories: [...cur, catId] }));
    }
  };

  const toggleSubcategory = (catId: string, subId: string) => {
    const cur = form.selectedSubcategories[catId] || [];
    const next = cur.includes(subId) ? cur.filter((s) => s !== subId) : [...cur, subId];
    setForm((p) => ({ ...p, selectedSubcategories: { ...p.selectedSubcategories, [catId]: next } }));
  };

  const toggleCondition = (c: 'new' | 'used') => {
    const cur = form.partConditions;
    set('partConditions', cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDone(true);
    setSubmitting(false);
  };

  const filteredBrands = CAR_BRANDS.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto mb-5">
          <Check size={36} className="text-teal" />
        </div>
        <h2 className="text-2xl font-black text-dark mb-2">Account Created!</h2>
        <p className="text-muted mb-6">
          {userType === 'buyer'
            ? 'Welcome to partz.ge! Start searching for your car parts.'
            : 'Your seller profile is ready. Requests will be sent based on your specialization.'}
        </p>
        <Link href={userType === 'buyer' ? '/request' : '/dashboard'} className="btn-teal">
          {userType === 'buyer' ? 'Find Parts Now' : 'Go to Dashboard'}
        </Link>
      </div>
    );
  }

  /* â”€â”€ Step 1: Choose user type â”€â”€ */
  if (!userType) {
    return (
      <div>
        <h2 className="text-2xl font-black text-dark mb-2 text-center">Join partz.ge</h2>
        <p className="text-muted text-sm text-center mb-8">How will you use the platform?</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => setUserType('buyer')}
            className="group p-6 rounded-2xl border-2 border-teal-border hover:border-teal hover:bg-teal-wash transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
              <ShoppingBag size={24} className="text-teal" />
            </div>
            <h3 className="text-lg font-black text-dark mb-1">I want to Buy</h3>
            <p className="text-sm text-muted">Search for parts, send requests, get offers from verified sellers.</p>
            <div className="mt-4 flex items-center gap-1.5 text-teal text-sm font-bold">Register as Buyer <ChevronRight size={15} /></div>
          </button>
          <button
            onClick={() => { setUserType('seller'); setSellerStep(2); }}
            className="group p-6 rounded-2xl border-2 border-teal-border hover:border-teal hover:bg-teal-wash transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
              <Store size={24} className="text-dark" />
            </div>
            <h3 className="text-lg font-black text-dark mb-1">I want to Sell</h3>
            <p className="text-sm text-muted">Open a shop or register as a dealer. Receive targeted part requests.</p>
            <div className="mt-4 flex items-center gap-1.5 text-dark text-sm font-bold">Register as Seller <ChevronRight size={15} /></div>
          </button>
        </div>
        <p className="text-center text-sm text-muted mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-teal font-bold hover:text-teal-dark">Sign in</Link>
        </p>
      </div>
    );
  }

  /* â”€â”€ BUYER FLOW â”€â”€ */
  if (userType === 'buyer') {
    return (
      <div>
        <button onClick={() => setUserType(null)} className="flex items-center gap-1.5 text-sm text-muted hover:text-dark mb-6 transition-colors">
          <ChevronLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
            <ShoppingBag size={20} className="text-teal" />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark">Buyer Account</h2>
            <p className="text-sm text-muted">Free â€” search and request parts</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Full Name *</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Giorgi Beridze" className="input-base pl-9" />
              </div>
            </div>
            <div>
              <label className="field-label">City *</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select value={form.city} onChange={(e) => set('city', e.target.value)} className="input-base pl-9 bg-white appearance-none">
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="field-label">Email *</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className="input-base pl-9" />
            </div>
          </div>
          <div>
            <label className="field-label">Phone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+995 5XX XXX XXX" className="input-base pl-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 8 characters" className="input-base pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="field-label">Confirm *</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} placeholder="Repeat" className="input-base" />
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} className="mt-1 accent-teal" />
            <span className="text-sm text-muted">
              I agree to the <Link href="/terms" className="text-teal font-semibold hover:underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-teal font-semibold hover:underline">Privacy Policy</Link>
            </span>
          </label>
          <button onClick={handleSubmit} disabled={!form.name || !form.email || !form.password || !form.terms || submitting} className="btn-teal w-full justify-center py-3.5">
            {submitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Buyer Account'}
          </button>
        </div>
        <p className="text-center text-sm text-muted mt-5">
          Already have an account? <Link href="/auth/login" className="text-teal font-bold hover:text-teal-dark">Sign in</Link>
        </p>
      </div>
    );
  }

  /* â”€â”€ SELLER FLOW â”€â”€ */
  const stepLabels = ['Type', 'Details', 'Vehicles', 'Parts', 'Account'];

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          {stepLabels.map((label, i) => {
            const step = i + 1;
            const isDone = sellerStep > step + 1;
            const isActive = sellerStep === step + 1;
            return (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 transition-all ${isDone ? 'bg-teal text-white' : isActive ? 'bg-teal text-white ring-4 ring-teal/20' : 'bg-teal-wash border border-teal-border text-muted'}`}>
                  {isDone ? <Check size={13} /> : step}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-teal' : isDone ? 'text-teal-dark' : 'text-muted'}`}>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="h-1 bg-teal-wash rounded-full overflow-hidden">
          <div className="h-full bg-teal rounded-full transition-all duration-500" style={{ width: `${((sellerStep - 2) / (TOTAL_SELLER_STEPS - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Step 2: Seller type */}
      {sellerStep === 2 && (
        <div>
          <button onClick={() => setUserType(null)} className="flex items-center gap-1.5 text-sm text-muted hover:text-dark mb-5"><ChevronLeft size={15} /> Back</button>
          <h2 className="text-xl font-black text-dark mb-1">What type of seller are you?</h2>
          <p className="text-sm text-muted mb-5">This determines how you operate on partz.ge</p>
          <div className="space-y-3 mb-6">
            {[
              { type: 'shop' as SellerType, icon: Store, title: 'Shop Owner', subtitle: 'I have a physical or online store', desc: 'Create a public storefront, list your inventory, and receive customer requests. Buyers can browse and purchase directly.', color: 'text-teal', bg: 'bg-teal/10' },
              { type: 'dealer' as SellerType, icon: Users, title: 'Parts Dealer', subtitle: 'I source and sell parts â€” no storefront', desc: 'Receive targeted requests from buyers who need parts matching your vehicle specialization. No storefront needed.', color: 'text-dark', bg: 'bg-teal/10' },
            ].map(({ type, icon: Icon, title, subtitle, desc, color, bg }) => (
              <button key={type!} onClick={() => set('sellerType', type)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${form.sellerType === type ? 'border-teal bg-teal-wash' : 'border-teal-border hover:border-teal/40'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={22} className={color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-dark">{title}</h3>
                      {form.sellerType === type && <Check size={14} className="text-teal" />}
                    </div>
                    <p className="text-xs text-teal font-semibold mb-1">{subtitle}</p>
                    <p className="text-sm text-muted">{desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setSellerStep(3)} disabled={!form.sellerType} className="btn-teal w-full justify-center py-3.5">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 3: Business details */}
      {sellerStep === 3 && (
        <div>
          <h2 className="text-xl font-black text-dark mb-1">Business Details</h2>
          <p className="text-sm text-muted mb-5">Your profile that buyers will see</p>
          <div className="space-y-4">
            <div>
              <label className="field-label">{form.sellerType === 'shop' ? 'Shop Name *' : 'Business / Your Name *'}</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input value={form.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder={form.sellerType === 'shop' ? 'e.g. AutoParts Tbilisi' : 'e.g. Giorgi Parts'} className="input-base pl-9" />
              </div>
            </div>
            <div>
              <label className="field-label">Contact Person *</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" className="input-base pl-9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">City *</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <select value={form.city} onChange={(e) => set('city', e.target.value)} className="input-base pl-9 bg-white appearance-none">
                    <option value="">Select</option>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Phone *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+995 5XX XXX XXX" className="input-base pl-9" />
                </div>
              </div>
            </div>
            {form.sellerType === 'shop' && (
              <div>
                <label className="field-label">Shop Address</label>
                <input value={form.businessAddress} onChange={(e) => set('businessAddress', e.target.value)} placeholder="Street address" className="input-base" />
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setSellerStep(2)} className="btn-secondary px-5"><ChevronLeft size={16} /></button>
            <button onClick={() => setSellerStep(4)} disabled={!form.businessName || !form.name || !form.city || !form.phone} className="btn-teal flex-1 justify-center py-3">
              Continue â€” Vehicle Specialization <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Vehicle specialization */}
      {sellerStep === 4 && (
        <div>
          <h2 className="text-xl font-black text-dark mb-1">Vehicle Specialization</h2>
          <p className="text-sm text-muted mb-1">
            Which brands and models do you sell parts for?
          </p>
          <p className="text-xs font-semibold text-teal mb-4">
            Requests are only sent to sellers who match the buyer&apos;s car brand.
          </p>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} placeholder="Search car brandsâ€¦" className="input-base pl-9" />
          </div>
          {form.selectedBrands.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {form.selectedBrands.map((id) => {
                const brand = CAR_BRANDS.find((b) => b.id === id);
                const modelCount = (form.brandModels[id] || []).length;
                return (
                  <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal/10 border border-teal/20 text-teal text-xs font-bold rounded-full">
                    {brand?.name}
                    {modelCount > 0 && <span className="bg-teal text-white rounded-full px-1.5 text-[10px]">{modelCount}</span>}
                    <button onClick={() => toggleBrand(id)} className="text-teal/60 hover:text-teal ml-0.5">âœ•</button>
                  </span>
                );
              })}
            </div>
          )}
          <div className="max-h-72 overflow-y-auto rounded-xl border border-teal-border divide-y divide-teal-border">
            {filteredBrands.map((brand) => {
              const selected = form.selectedBrands.includes(brand.id);
              const expanded = expandedBrand === brand.id;
              const selectedModels = form.brandModels[brand.id] || [];
              return (
                <div key={brand.id}>
                  <div className={`flex items-center gap-3 px-4 py-3 ${selected ? 'bg-teal/5' : 'bg-white hover:bg-teal-wash'}`}>
                    <button onClick={() => toggleBrand(brand.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${selected ? 'bg-teal border-teal' : 'border-teal-border hover:border-teal'}`}>
                      {selected && <Check size={11} className="text-white" />}
                    </button>
                    <span className={`flex-1 text-sm font-semibold ${selected ? 'text-dark' : 'text-muted'}`}>{brand.name}</span>
                    {selected && (
                      <button onClick={() => setExpandedBrand(expanded ? null : brand.id)}
                        className="text-xs text-teal font-bold flex items-center gap-0.5 shrink-0">
                        {selectedModels.length > 0 ? `${selectedModels.length} models` : 'Select models'}
                        <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                  </div>
                  {selected && expanded && (
                    <div className="bg-teal-wash px-4 py-3 flex flex-wrap gap-1.5">
                      <button onClick={() => setForm((p) => ({ ...p, brandModels: { ...p.brandModels, [brand.id]: [] } }))}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedModels.length === 0 ? 'bg-teal text-white border-teal' : 'bg-white border-teal-border text-muted hover:border-teal'}`}>
                        All Models
                      </button>
                      {brand.models.map((model) => (
                        <button key={model} onClick={() => toggleModel(brand.id, model)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedModels.includes(model) ? 'bg-teal text-white border-teal' : 'bg-white border-teal-border text-muted hover:border-teal'}`}>
                          {model}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {form.selectedBrands.length === 0 && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted">
              <AlertCircle size={13} /> Select at least one brand
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setSellerStep(3)} className="btn-secondary px-5"><ChevronLeft size={16} /></button>
            <button onClick={() => setSellerStep(5)} disabled={form.selectedBrands.length === 0} className="btn-teal flex-1 justify-center py-3">
              Continue â€” Parts Profile <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Parts profile */}
      {sellerStep === 5 && (
        <div>
          <h2 className="text-xl font-black text-dark mb-1">Parts Profile</h2>
          <p className="text-sm text-muted mb-5">What types of parts do you sell?</p>
          <div className="mb-5">
            <label className="field-label mb-2">Part Condition *</label>
            <div className="flex gap-3">
              {(['new', 'used'] as const).map((c) => (
                <button key={c} onClick={() => toggleCondition(c)}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${form.partConditions.includes(c) ? 'bg-teal text-white border-teal' : 'border-teal-border text-muted hover:border-teal'}`}>
                  {c === 'new' ? 'âœ¨ New Parts' : 'ðŸ”§ Used Parts'}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-1.5">Select both if you sell new and used</p>
          </div>
          <div>
            <label className="field-label mb-2">Categories & Subcategories *</label>
            <p className="text-xs text-muted mb-3">Select your specialization. Expand a category to pick subcategories.</p>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => {
                const selected = form.selectedCategories.includes(cat.id);
                const expanded = expandedCategory === cat.id;
                const selectedSubs = form.selectedSubcategories[cat.id] || [];
                return (
                  <div key={cat.id} className={`rounded-xl border-2 overflow-hidden transition-all ${selected ? 'border-teal/40' : 'border-teal-border'}`}>
                    <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selected ? 'bg-teal/5' : 'bg-white hover:bg-teal-wash'}`}>
                      <button onClick={() => toggleCategory(cat.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selected ? 'bg-teal border-teal' : 'border-teal-border hover:border-teal'}`}>
                        {selected && <Check size={11} className="text-white" />}
                      </button>
                      <span className="text-base">{cat.icon}</span>
                      <span className={`flex-1 text-sm font-semibold ${selected ? 'text-dark' : 'text-muted'}`}>{cat.name}</span>
                      {selected && (
                        <button onClick={() => setExpandedCategory(expanded ? null : cat.id)}
                          className="text-xs text-teal font-bold flex items-center gap-0.5 shrink-0">
                          {selectedSubs.length > 0 ? `${selectedSubs.length} sub` : 'Subcategories'}
                          <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>
                    {selected && expanded && (
                      <div className="bg-teal-wash px-4 py-3 flex flex-wrap gap-1.5 border-t border-teal-border">
                        <button onClick={() => setForm((p) => ({ ...p, selectedSubcategories: { ...p.selectedSubcategories, [cat.id]: [] } }))}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedSubs.length === 0 ? 'bg-teal text-white border-teal' : 'bg-white border-teal-border text-muted hover:border-teal'}`}>
                          All
                        </button>
                        {cat.subcategories.map((sub) => (
                          <button key={sub.id} onClick={() => toggleSubcategory(cat.id, sub.id)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedSubs.includes(sub.id) ? 'bg-teal text-white border-teal' : 'bg-white border-teal-border text-muted hover:border-teal'}`}>
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setSellerStep(4)} className="btn-secondary px-5"><ChevronLeft size={16} /></button>
            <button onClick={() => setSellerStep(6)} disabled={form.partConditions.length === 0 || form.selectedCategories.length === 0} className="btn-teal flex-1 justify-center py-3">
              Continue â€” Account <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Account credentials */}
      {sellerStep === 6 && (
        <div>
          <h2 className="text-xl font-black text-dark mb-1">Create Your Account</h2>
          <p className="text-sm text-muted mb-5">Last step â€” set your login credentials</p>
          <div className="space-y-4">
            <div>
              <label className="field-label">Email *</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className="input-base pl-9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 8 chars" className="input-base pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="field-label">Confirm *</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} placeholder="Repeat" className="input-base" />
              </div>
            </div>
            <div className="bg-teal-wash rounded-xl p-4 text-sm space-y-1.5 border border-teal-border">
              <p className="font-bold text-dark text-xs uppercase tracking-wider mb-2">Profile Summary</p>
              <p className="text-muted"><span className="text-dark font-semibold">Type:</span> {form.sellerType === 'shop' ? 'Shop Owner' : 'Parts Dealer'}</p>
              <p className="text-muted"><span className="text-dark font-semibold">Name:</span> {form.businessName}</p>
              <p className="text-muted"><span className="text-dark font-semibold">Location:</span> {form.city}</p>
              <p className="text-muted"><span className="text-dark font-semibold">Brands:</span> {form.selectedBrands.length} selected</p>
              <p className="text-muted"><span className="text-dark font-semibold">Categories:</span> {form.selectedCategories.length} selected</p>
              <p className="text-muted"><span className="text-dark font-semibold">Condition:</span> {form.partConditions.join(' & ')}</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} className="mt-1 accent-teal" />
              <span className="text-sm text-muted">
                I agree to the <Link href="/terms" className="text-teal font-semibold hover:underline">Terms</Link> and{' '}
                <Link href="/privacy" className="text-teal font-semibold hover:underline">Privacy Policy</Link>
              </span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setSellerStep(5)} className="btn-secondary px-5"><ChevronLeft size={16} /></button>
            <button onClick={handleSubmit} disabled={!form.email || !form.password || !form.terms || submitting} className="btn-primary flex-1 justify-center py-3.5">
              {submitting ? <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" /> : 'Create Seller Account ðŸŽ‰'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-teal-wash flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center">
              <Car size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-dark">partz<span className="text-teal">.ge</span></span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl p-7 card-shadow border border-teal-border">
          <Suspense fallback={
            <div className="flex justify-center py-12">
              <span className="w-7 h-7 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
            </div>
          }>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

