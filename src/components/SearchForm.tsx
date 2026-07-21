'use client';

<<<<<<< HEAD
import { useState, useRef } from 'react';
import { Search, X, Zap, ChevronDown, Camera, AlertCircle } from 'lucide-react';
=======
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Zap, ChevronDown, Camera, AlertCircle } from 'lucide-react';
import { shopsApi, vinApi, uploadsApi, requestsApi, getUser, resolveUploadUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a

const YEARS = Array.from({ length: 35 }, (_, i) => String(2025 - i));

type Mode = 'vin' | 'manual';

interface UploadedFile { name: string; url: string; }

export default function SearchForm() {
  const router = useRouter();
  const { t } = useLanguage();

  const [brands, setBrands] = useState<any[]>([]);
  useEffect(() => { shopsApi.brands().then(setBrands).catch(() => []); }, []);

  const [mode, setMode] = useState<Mode>('vin');
  const [vin, setVin] = useState('');
  const [vinLoading, setVinLoading] = useState(false);
  const [vinDecoded, setVinDecoded] = useState(false);
  const [vinError, setVinError] = useState('');
  const [brandId, setBrandId] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const brandName = brands.find((b) => String(b.id) === brandId)?.name || '';

  const handleVinDecode = async () => {
    if (vin.trim().length < 5) return;
    setVinLoading(true);
    setVinError('');
    try {
      const result = await vinApi.decode(vin.trim());
      if (!result.matched || !result.brand_id) {
        setVinError(t('heroSearch.vinNotFound'));
        return;
      }
      setBrandId(String(result.brand_id));
      if (result.model_name) setModel(result.model_name);
      if (result.year) setYear(result.year);
      setVinDecoded(true);
    } catch {
      setVinError(t('common.error'));
    } finally {
      setVinLoading(false);
    }
  };

  const handleFiles = async (incoming: FileList | null) => {
    if (!incoming) return;
    setUploading(true);
    try {
      for (const f of Array.from(incoming).slice(0, 5 - files.length)) {
        const { url } = await uploadsApi.upload(f);
        setFiles((prev) => [...prev, { name: f.name, url }]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const user = getUser();
    if (!user) { router.push('/auth/login?redirect=/'); return; }
    if (!brandId || !description.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const fullDescription = engine.trim()
        ? `${description.trim()} (${t('heroSearch.engine')}: ${engine.trim()})`
        : description.trim();
      await requestsApi.create({
        brand_id: Number(brandId),
        year: year || undefined,
        description: fullDescription,
        images: files.length ? files.map((f) => f.url) : undefined,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setSubmitError(err.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-teal overflow-hidden">
      {/* Header strip */}
      <div className="bg-teal px-5 sm:px-6 py-3.5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <Search size={14} className="text-white" />
        </div>
        <div>
          <h2 className="text-white font-black text-sm leading-tight">Find Your Part in Seconds</h2>
          <p className="text-white/75 text-xs font-medium">Enter your VIN or pick your car manually</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex bg-cream p-1 gap-1">
        <button
          onClick={() => setMode('vin')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-black transition-all ${mode === 'vin' ? 'bg-teal text-white shadow-md' : 'text-dark hover:bg-white'}`}
        >
<<<<<<< HEAD
          <Zap size={13} className={mode === 'vin' ? 'fill-white' : ''} />
          VIN Code (Auto-detect)
=======
          <Zap size={15} />
          {t('heroSearch.vinMode')}
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-black transition-all ${mode === 'manual' ? 'bg-teal text-white shadow-md' : 'text-dark hover:bg-white'}`}
        >
<<<<<<< HEAD
          <ChevronDown size={13} />
          Choose Manually
=======
          <ChevronDown size={15} />
          {t('heroSearch.manualMode')}
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* VIN mode */}
        {mode === 'vin' && (
          <div>
<<<<<<< HEAD
            <label className="block text-xs font-black text-dark mb-1.5">
              Vehicle Identification Number (VIN)
=======
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              {t('heroSearch.vinLabel')}
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  value={vin}
                  onChange={(e) => { setVin(e.target.value.toUpperCase()); setVinDecoded(false); setVinError(''); }}
                  maxLength={17}
                  placeholder="e.g. WBABF91040LT52395"
                  className="input-base pr-10 font-mono tracking-widest text-sm border-2 border-teal-border focus:border-teal"
                />
                {vin && (
                  <button onClick={() => { setVin(''); setVinDecoded(false); setVinError(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-dark transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={handleVinDecode}
<<<<<<< HEAD
                disabled={vin.length < 17 || vinLoading}
                className="px-4 py-2.5 bg-teal text-white text-sm font-black rounded-lg hover:bg-teal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
=======
                disabled={vin.trim().length < 5 || vinLoading}
                className="px-5 py-2.5 bg-teal text-white text-sm font-bold rounded-lg hover:bg-teal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
              >
                {vinLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('search.decoding')}</>
                ) : (
                  <><Zap size={14} />{t('heroSearch.decode')}</>
                )}
              </button>
            </div>
<<<<<<< HEAD
            <p className="text-xs text-muted mt-1.5 flex items-center gap-1.5">
              <AlertCircle size={12} className="text-teal shrink-0" />
              17-character VIN found on dashboard or vehicle registration
=======
            <p className="text-xs text-subtle mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} />
              {t('search.vinHint')}
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
            </p>
            {vinError && <p className="text-xs text-red-500 font-semibold mt-1.5">{vinError}</p>}
          </div>
        )}

        {/* Vehicle fields — shown after VIN decode or in manual mode */}
        {(vinDecoded || mode === 'manual') && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-black text-dark mb-1">Brand</label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="input-base bg-white appearance-none border-2 border-teal-border focus:border-teal">
                <option value="">Select Brand</option>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-dark mb-1">Model</label>
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. 3 Series, Golf" className="input-base border-2 border-teal-border focus:border-teal" />
            </div>
            <div>
              <label className="block text-xs font-black text-dark mb-1">Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="input-base bg-white appearance-none border-2 border-teal-border focus:border-teal">
                <option value="">Select Year</option>
=======
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('heroSearch.brand')}</label>
              <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="input-base bg-white appearance-none">
                <option value="">{t('search.selectBrand')}</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('heroSearch.model')}</label>
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder={t('heroSearch.modelPlaceholder')} className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('heroSearch.year')}</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="input-base bg-white appearance-none">
                <option value="">{t('heroSearch.selectYear')}</option>
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-black text-dark mb-1">Engine</label>
              <input value={engine} onChange={(e) => setEngine(e.target.value)} placeholder="e.g. 2.0L Diesel, 1.6T" className="input-base border-2 border-teal-border focus:border-teal" />
=======
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('heroSearch.engine')}</label>
              <input value={engine} onChange={(e) => setEngine(e.target.value)} placeholder={t('heroSearch.enginePlaceholder')} className="input-base" />
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
            </div>
          </div>
        )}

<<<<<<< HEAD
        {vinDecoded && (
          <div className="flex items-center gap-2 p-2.5 bg-teal-wash rounded-lg border-2 border-teal/25 text-xs text-teal-dark font-bold">
            <Zap size={13} className="fill-teal text-teal shrink-0" />
            Vehicle detected: {brand} {model} {year} · {engine}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Description */}
          <div>
            <label className="block text-xs font-black text-dark mb-1">
              Describe the part you need
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="E.g. Right front door mirror with turn signal, OEM preferred..."
              className="input-base resize-none h-full border-2 border-teal-border focus:border-teal"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-black text-dark mb-1">
              Upload Photos <span className="text-muted font-normal normal-case">(broken/damaged part)</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${dragOver ? 'border-teal bg-teal-wash' : 'border-teal-border hover:border-teal hover:bg-teal-wash'}`}
            >
              <Camera size={18} className="mx-auto mb-1 text-teal" />
              <p className="text-xs font-bold text-dark">Drop photos here or <span className="text-teal font-black">browse</span></p>
              <p className="text-[11px] text-muted mt-0.5">PNG, JPG up to 10MB · max 5 files</p>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
=======
        {vinDecoded && brandName && (
          <div className="flex items-center gap-2 p-3 bg-teal/10 rounded-xl border border-teal/20 text-sm text-teal font-semibold">
            <Zap size={14} className="fill-teal" />
            {t('heroSearch.vehicleDetected')}: {brandName} {model} {year}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            {t('heroSearch.descLabel')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={t('heroSearch.descPlaceholder')}
            className="input-base resize-none"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            {t('heroSearch.uploadLabel')} <span className="text-subtle font-normal normal-case">({t('heroSearch.uploadSub')})</span>
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragOver ? 'border-teal bg-teal/5' : 'border-teal-border hover:border-teal/50 hover:bg-teal-wash'}`}
          >
            <Camera size={24} className="mx-auto mb-2 text-subtle" />
            <p className="text-sm font-medium text-muted">
              {uploading ? t('request.uploading') : (
                <>{t('heroSearch.dropHere')} <span className="text-teal font-bold">{t('heroSearch.browse')}</span></>
              )}
            </p>
            <p className="text-xs text-subtle mt-0.5">PNG, JPG · {t('heroSearch.maxFiles')}</p>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden disabled={uploading} onChange={(e) => handleFiles(e.target.files)} />
          </div>

          {files.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {files.map((f, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveUploadUrl(f.url)} alt={f.name} className="w-16 h-16 object-cover rounded-lg border-2 border-teal-border" />
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
            </div>

            {files.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {files.map((f, i) => (
                  <div key={i} className="relative group">
                    <img src={f.url} alt={f.name} className="w-12 h-12 object-cover rounded-lg border-2 border-teal-border" />
                    <button
                      onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {submitError && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
            {submitError}
          </div>
        )}

        {/* Submit */}
<<<<<<< HEAD
        <button className="btn-primary w-full text-sm py-3 rounded-lg justify-center shadow-md mt-2">
          <Search size={16} />
          Find My Part
=======
        <button
          onClick={handleSubmit}
          disabled={!brandId || !description.trim() || submitting}
          className="btn-primary w-full text-base py-4 rounded-xl justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Search size={18} /> {t('heroSearch.submit')}</>
          )}
>>>>>>> 451dbd2dd5ca74f05b7b85c8bbab38be61d9b87a
        </button>
      </div>
    </div>
  );
}
