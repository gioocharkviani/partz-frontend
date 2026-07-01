'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Clock, Users, CheckCircle, Send, ChevronDown, LogIn } from 'lucide-react';
import { getUser, shopsApi, requestsApi } from '@/lib/api';

export default function RequestPage() {
  const router = useRouter();
  const user = getUser();

  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const YEARS = Array.from({ length: 35 }, (_, i) => String(2025 - i));

  useEffect(() => {
    shopsApi.brands().then(setBrands).catch(() => []);
    shopsApi.categories().then(setCategories).catch(() => []);
  }, []);

  useEffect(() => {
    if (!brandId) { setModels([]); setModelId(''); return; }
    shopsApi.modelsByBrand(Number(brandId)).then(setModels).catch(() => []);
    setModelId('');
  }, [brandId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/auth/login?redirect=/request'); return; }
    if (!brandId || !description.trim()) return;
    setError(''); setSubmitting(true);
    try {
      await requestsApi.create({
        brand_id: Number(brandId),
        model_id: modelId ? Number(modelId) : undefined,
        year: year || undefined,
        description,
        category_id: categoryId ? Number(categoryId) : undefined,
      });
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-teal-wash flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 card-shadow border border-teal-border text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-teal" />
          </div>
          <h2 className="text-2xl font-black text-dark mb-2">Request Sent!</h2>
          <p className="text-muted mb-2">Your part request has been sent to matching sellers.</p>
          <p className="text-sm text-muted mb-8">You&apos;ll receive email notifications when sellers make offers. Check your dashboard to review and accept offers.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="btn-teal">View My Requests</Link>
            <button onClick={() => { setDone(false); setBrandId(''); setModelId(''); setYear(''); setCategoryId(''); setDescription(''); }}
              className="btn-secondary px-5">New Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">Free Service</span>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">Find Your Car Part</h1>
            <p className="text-white/75 leading-relaxed">
              Tell us what you need — our network of verified sellers will send you competitive offers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Main form */}
          <div className="lg:col-span-2">
            {!user ? (
              /* Not logged in — prompt */
              <div className="bg-white rounded-2xl p-8 card-shadow border border-teal-border text-center">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                  <LogIn size={28} className="text-teal" />
                </div>
                <h3 className="text-xl font-black text-dark mb-2">Sign in to send a request</h3>
                <p className="text-muted text-sm mb-6">You need an account to send part requests and receive offers from sellers.</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/auth/login?redirect=/request" className="btn-teal">Sign In</Link>
                  <Link href="/auth/register" className="btn-secondary px-5">Create Account</Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-teal-border">
                <div className="px-6 py-4 bg-teal-wash border-b border-teal-border">
                  <h2 className="font-black text-dark">Part Request Details</h2>
                  <p className="text-sm text-muted">Sellers matching your car brand will be notified instantly</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Brand + Model */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">Car Brand *</label>
                      <div className="input-wrap">
                        <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required
                          className="bg-white appearance-none">
                          <option value="">Select brand</option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                        <span className="input-end"><ChevronDown size={14} /></span>
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Model</label>
                      <div className="input-wrap">
                        <select value={modelId} onChange={(e) => setModelId(e.target.value)}
                          disabled={!brandId || models.length === 0}
                          className="bg-white appearance-none disabled:opacity-50">
                          <option value="">All models</option>
                          {models.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <span className="input-end"><ChevronDown size={14} /></span>
                      </div>
                    </div>
                  </div>

                  {/* Year + Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">Year</label>
                      <div className="input-wrap">
                        <select value={year} onChange={(e) => setYear(e.target.value)}
                          className="bg-white appearance-none">
                          <option value="">Any year</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <span className="input-end"><ChevronDown size={14} /></span>
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Part Category</label>
                      <div className="input-wrap">
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                          className="bg-white appearance-none">
                          <option value="">Any category</option>
                          {categories.filter(c => !c.parent_id).map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <span className="input-end"><ChevronDown size={14} /></span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="field-label">Describe the part you need *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                      placeholder="e.g. Right front door mirror with turn signal, OEM preferred. Minor scratches acceptable."
                      className="input-base resize-none"
                    />
                    <p className="text-xs text-muted mt-1">Be specific — condition preference, OEM vs aftermarket, part number if known</p>
                  </div>

                  {/* Brand match notice */}
                  {brandId && (
                    <div className="flex items-start gap-3 bg-teal-wash border border-teal-border rounded-xl p-4">
                      <CheckCircle size={16} className="text-teal mt-0.5 shrink-0" />
                      <div className="text-sm text-muted">
                        <span className="font-bold text-dark">Sellers specializing in {brands.find(b => b.id === Number(brandId))?.name || 'this brand'}</span>{' '}
                        will be notified automatically. Only matching sellers receive your request.
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={!brandId || !description.trim() || submitting}
                    className="btn-teal w-full py-4 text-base justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {submitting
                      ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Send size={18} /> Send Request to Sellers</>
                    }
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
              <h3 className="font-black text-dark mb-4">How it works</h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Select your car brand and model, then describe the part you need' },
                  { step: '2', text: 'Only sellers specializing in your car brand are notified' },
                  { step: '3', text: 'You receive competitive offers with prices and delivery times' },
                  { step: '4', text: 'Accept the best offer and complete your order securely' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{item.step}</div>
                    <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-teal rounded-2xl p-6 card-shadow">
              <h3 className="font-black text-white mb-4">Why partz.ge?</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'All sellers are verified' },
                  { icon: Clock, text: 'Get offers within minutes' },
                  { icon: Users, text: '320+ active sellers' },
                  { icon: CheckCircle, text: 'Buyer protection guaranteed' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-white/75">
                    <Icon size={14} className="text-yellow shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
