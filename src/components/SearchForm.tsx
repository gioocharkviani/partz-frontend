'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, ChevronDown, AlertCircle, Car } from 'lucide-react';
import { shopsApi, vinApi } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

type Mode = 'vehicle' | 'vin' | 'text';

export default function SearchForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>('vehicle');

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [vin, setVin] = useState('');
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState('');

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    shopsApi.brands().then(setBrands).catch(() => []);
    shopsApi.categories().then(setCategories).catch(() => []);
  }, []);

  const goToParts = (params: Record<string, string>) => {
    const qs = new URLSearchParams(params);
    router.push(`/parts?${qs.toString()}`);
  };

  const handleVehicleSearch = () => {
    const params: Record<string, string> = {};
    if (brandId) params.brand_id = brandId;
    if (categoryId) params.category_id = categoryId;
    goToParts(params);
  };

  const handleVinSearch = async () => {
    if (vin.trim().length < 5) return;
    setVinLoading(true);
    setVinError('');
    try {
      const result = await vinApi.decode(vin.trim());
      if (!result.matched || !result.brand_id) {
        setVinError(t('search.byVin') + ' — ' + t('common.error'));
        return;
      }
      const params: Record<string, string> = { brand_id: String(result.brand_id) };
      if (categoryId) params.category_id = categoryId;
      goToParts(params);
    } catch {
      setVinError(t('common.error'));
    } finally {
      setVinLoading(false);
    }
  };

  const handleTextSearch = () => {
    const params: Record<string, string> = {};
    if (keyword.trim()) params.q = keyword.trim();
    if (categoryId) params.category_id = categoryId;
    goToParts(params);
  };

  const tabs: { key: Mode; label: string; icon: typeof Car }[] = [
    { key: 'vehicle', label: t('search.byVehicle'), icon: Car },
    { key: 'vin', label: t('search.byVin'), icon: Zap },
    { key: 'text', label: t('search.byText'), icon: Search },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Mode toggle */}
      <div className="flex">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${
              mode === key ? 'border-teal text-teal bg-teal-wash' : 'border-transparent text-muted hover:text-dark hover:bg-teal-wash'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-5">
        {mode === 'vehicle' && (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('search.brand')}</label>
              <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="input-base bg-white appearance-none">
                <option value="">{t('search.selectBrand')}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {mode === 'vin' && (
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              VIN
            </label>
            <div className="flex gap-2">
              <input
                value={vin}
                onChange={(e) => { setVin(e.target.value.toUpperCase()); setVinError(''); }}
                maxLength={17}
                placeholder={t('search.vinPlaceholder')}
                className="input-base font-mono tracking-widest text-sm flex-1"
              />
              <button
                onClick={handleVinSearch}
                disabled={vin.trim().length < 5 || vinLoading}
                className="px-5 py-2.5 bg-teal text-white text-sm font-bold rounded-lg hover:bg-teal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {vinLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('search.decoding')}</>
                ) : (
                  <><Zap size={14} />{t('search.searchBtn')}</>
                )}
              </button>
            </div>
            <p className="text-xs text-subtle mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} />
              {t('search.vinHint')}
            </p>
            {vinError && <p className="text-xs text-red-500 mt-1.5 font-semibold">{vinError}</p>}
          </div>
        )}

        {mode === 'text' && (
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('search.byText')}</label>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('search.textPlaceholder')}
              onKeyDown={(e) => e.key === 'Enter' && handleTextSearch()}
              className="input-base"
            />
          </div>
        )}

        {/* Category filter — shared across modes */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{t('search.category')}</label>
          <div className="relative">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-base bg-white appearance-none pr-9">
              <option value="">{t('search.allCategories')}</option>
              {categories.filter((c) => !c.parent_id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
          </div>
        </div>

        <button
          onClick={mode === 'vehicle' ? handleVehicleSearch : mode === 'vin' ? handleVinSearch : handleTextSearch}
          disabled={mode === 'vin' && (vin.trim().length < 5 || vinLoading)}
          className="btn-primary w-full text-base py-4 rounded-xl justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={18} />
          {t('search.searchBtn')}
        </button>
      </div>
    </div>
  );
}
