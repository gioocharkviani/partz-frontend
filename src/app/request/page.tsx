'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Clock, Users, CheckCircle, Send, ChevronDown, LogIn, Camera, X } from 'lucide-react';
import { getUser, shopsApi, requestsApi, uploadsApi, resolveUploadUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function RequestPage() {
  const router = useRouter();
  const user = getUser();
  const { t } = useLanguage();

  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 4 - images.length)) {
        const { url } = await uploadsApi.upload(file);
        setImages((prev) => [...prev, url]);
      }
    } finally {
      setUploading(false);
    }
  };

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
        images: images.length ? images : undefined,
      });
      setDone(true);
    } catch (err: any) {
      setError(err.message || t('common.error'));
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
          <h2 className="text-2xl font-black text-dark mb-2">{t('request.successTitle')}</h2>
          <p className="text-muted mb-2">{t('request.successDesc')}</p>
          <p className="text-sm text-muted mb-8">{t('request.successDesc2')}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="btn-teal">{t('request.viewRequests')}</Link>
            <button onClick={() => { setDone(false); setBrandId(''); setModelId(''); setYear(''); setCategoryId(''); setDescription(''); }}
              className="btn-secondary px-5">{t('request.newRequest')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-14">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">{t('request.freeService')}</span>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">{t('request.title')}</h1>
            <p className="text-white/75 leading-relaxed">
              {t('request.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Main form */}
          <div className="lg:col-span-2">
            {!user ? (
              /* Not logged in — prompt */
              <div className="bg-white rounded-2xl p-8 card-shadow border border-teal-border text-center">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                  <LogIn size={28} className="text-teal" />
                </div>
                <h3 className="text-xl font-black text-dark mb-2">{t('request.signInTitle')}</h3>
                <p className="text-muted text-sm mb-6">{t('request.signInDesc')}</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/auth/login?redirect=/request" className="btn-teal">{t('auth.submitLogin')}</Link>
                  <Link href="/auth/register" className="btn-secondary px-5">{t('request.createAccount')}</Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-teal-border">
                <div className="px-6 py-4 bg-teal-wash border-b border-teal-border">
                  <h2 className="font-black text-dark">{t('request.formTitle')}</h2>
                  <p className="text-sm text-muted">{t('request.formSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Brand + Model */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">{t('request.brandRequired')}</label>
                      <div className="input-wrap">
                        <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required
                          className="bg-white appearance-none">
                          <option value="">{t('search.selectBrand')}</option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                        <span className="input-end"><ChevronDown size={14} /></span>
                      </div>
                    </div>
                    <div>
                      <label className="field-label">{t('request.model')}</label>
                      <div className="input-wrap">
                        <select value={modelId} onChange={(e) => setModelId(e.target.value)}
                          disabled={!brandId || models.length === 0}
                          className="bg-white appearance-none disabled:opacity-50">
                          <option value="">{t('request.allModels')}</option>
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
                      <label className="field-label">{t('request.year')}</label>
                      <div className="input-wrap">
                        <select value={year} onChange={(e) => setYear(e.target.value)}
                          className="bg-white appearance-none">
                          <option value="">{t('request.anyYear')}</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <span className="input-end"><ChevronDown size={14} /></span>
                      </div>
                    </div>
                    <div>
                      <label className="field-label">{t('request.category')}</label>
                      <div className="input-wrap">
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                          className="bg-white appearance-none">
                          <option value="">{t('request.anyCategory')}</option>
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
                    <label className="field-label">{t('request.description')}</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                      placeholder={t('request.descPlaceholder')}
                      className="input-base resize-none"
                    />
                    <p className="text-xs text-muted mt-1">{t('request.descHint')}</p>
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="field-label">{t('request.photos')}</label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-teal-border rounded-xl p-5 text-center cursor-pointer hover:border-teal/50 hover:bg-teal-wash/50 transition-all">
                      <Camera size={22} className="mx-auto mb-1.5 text-dark/30" />
                      <p className="text-xs font-medium text-muted">{uploading ? t('request.uploading') : t('request.addPhotos')}</p>
                      <input ref={fileRef} type="file" accept="image/*" multiple hidden disabled={uploading}
                        onChange={(e) => handleFiles(e.target.files)} />
                    </div>
                    {images.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {images.map((url, i) => (
                          <div key={i} className="relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={resolveUploadUrl(url)} alt="" className="w-16 h-16 object-cover rounded-lg border border-teal-border" />
                            <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Brand match notice */}
                  {brandId && (
                    <div className="flex items-start gap-3 bg-teal-wash border border-teal-border rounded-xl p-4">
                      <CheckCircle size={16} className="text-teal mt-0.5 shrink-0" />
                      <div className="text-sm text-muted">
                        <span className="font-bold text-dark">{t('request.matchNoticePrefix')} {brands.find(b => b.id === Number(brandId))?.name || t('request.matchNoticeThisBrand')}</span>{' '}
                        {t('request.matchNoticeSuffix')}
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
                      : <><Send size={18} /> {t('request.submit')}</>
                    }
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
              <h3 className="font-black text-dark mb-4">{t('request.howTitle')}</h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: t('request.how1') },
                  { step: '2', text: t('request.how2') },
                  { step: '3', text: t('request.how3') },
                  { step: '4', text: t('request.how4') },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{item.step}</div>
                    <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-teal rounded-2xl p-6 card-shadow">
              <h3 className="font-black text-white mb-4">{t('request.whyTitle')}</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: t('request.why1') },
                  { icon: Clock, text: t('request.why2') },
                  { icon: Users, text: t('request.why3') },
                  { icon: CheckCircle, text: t('request.why4') },
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
