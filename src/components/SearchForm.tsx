'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Zap, ChevronDown, Camera, AlertCircle } from 'lucide-react';
import { shopsApi, vinApi, uploadsApi, requestsApi, getUser, resolveUploadUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

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
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Mode toggle */}
      <div className="flex">
        <button
          onClick={() => setMode('vin')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${mode === 'vin' ? 'border-teal text-teal bg-teal-wash' : 'border-transparent text-muted hover:text-dark hover:bg-teal-wash'}`}
        >
          <Zap size={15} />
          {t('heroSearch.vinMode')}
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${mode === 'manual' ? 'border-teal text-teal bg-teal-wash' : 'border-transparent text-muted hover:text-dark hover:bg-teal-wash'}`}
        >
          <ChevronDown size={15} />
          {t('heroSearch.manualMode')}
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* VIN mode */}
        {mode === 'vin' && (
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              {t('heroSearch.vinLabel')}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  value={vin}
                  onChange={(e) => { setVin(e.target.value.toUpperCase()); setVinDecoded(false); setVinError(''); }}
                  maxLength={17}
                  placeholder="e.g. WBABF91040LT52395"
                  className="input-base pr-10 font-mono tracking-widest text-sm"
                />
                {vin && (
                  <button onClick={() => { setVin(''); setVinDecoded(false); setVinError(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-dark transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={handleVinDecode}
                disabled={vin.trim().length < 5 || vinLoading}
                className="px-5 py-2.5 bg-teal text-white text-sm font-bold rounded-lg hover:bg-teal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {vinLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('search.decoding')}</>
                ) : (
                  <><Zap size={14} />{t('heroSearch.decode')}</>
                )}
              </button>
            </div>
            <p className="text-xs text-subtle mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} />
              {t('search.vinHint')}
            </p>
            {vinError && <p className="text-xs text-red-500 font-semibold mt-1.5">{vinError}</p>}
          </div>
        )}

        {/* Vehicle fields — shown after VIN decode or in manual mode */}
        {(vinDecoded || mode === 'manual') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
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
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('heroSearch.engine')}</label>
              <input value={engine} onChange={(e) => setEngine(e.target.value)} placeholder={t('heroSearch.enginePlaceholder')} className="input-base" />
            </div>
          </div>
        )}

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
            </div>
          )}
        </div>

        {submitError && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
            {submitError}
          </div>
        )}

        {/* Submit */}
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
        </button>
      </div>
    </div>
  );
}
