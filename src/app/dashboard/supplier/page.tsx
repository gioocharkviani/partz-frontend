'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageCircle, CheckCircle, DollarSign, Send, Package,
  ChevronLeft, AlertCircle, Plus, X, Car, Settings, ChevronDown, Tag,
  Layers, Camera, Trash2, Edit2, Eye, EyeOff, AlertTriangle,
} from 'lucide-react';
import { getUser, requestsApi, ordersApi, shopsApi, partsApi, uploadsApi, resolveUploadUrl } from '@/lib/api';
import { useSocketEvent } from '@/lib/socket';
import { useLanguage } from '@/context/LanguageContext';

type Tab = 'requests' | 'quotes' | 'orders' | 'setup' | 'inventory';

function QuoteModal({ request, onClose, onSent }: { request: any; onClose: () => void; onSent: () => void }) {
  const { t } = useLanguage();
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
        description: description || `${t('supplierPanel.availablePartFor')} ${request.brand?.name || ''} ${request.model?.name || ''}`,
        part_number: partNumber || undefined,
        condition,
        delivery_days: deliveryDays || undefined,
      });
      onSent();
      onClose();
    } catch (e: any) {
      setErr(e.message || t('supplierPanel.quoteFailedToSend'));
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
          <strong className="text-dark">{t('supplierPanel.customerRequestLabel')} </strong>{request.description}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">{t('supplierPanel.yourPriceLabel')}</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0" className="input-base" min="0" />
            </div>
            <div>
              <label className="field-label">{t('supplierPanel.partNumberLabel')}</label>
              <input value={partNumber} onChange={(e) => setPartNumber(e.target.value)}
                placeholder={t('supplierPanel.optionalPlaceholder')} className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">{t('supplierPanel.conditionRequired')}</label>
              <div className="input-wrap">
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className="bg-white appearance-none">
                  <option value="new">{t('product.new')}</option>
                  <option value="used">{t('supplierPanel.usedGood')}</option>
                  <option value="refurbished">{t('product.refurbished')}</option>
                </select>
                <span className="input-end"><ChevronDown size={13} /></span>
              </div>
            </div>
            <div>
              <label className="field-label">{t('supplierPanel.deliveryDaysLabel')}</label>
              <input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)}
                placeholder={t('supplierPanel.deliveryDaysPlaceholder')} className="input-base" />
            </div>
          </div>
          <div>
            <label className="field-label">{t('supplierPanel.descriptionNoteLabel')}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2} placeholder={t('supplierPanel.descNotePlaceholder')} className="input-base resize-none" />
          </div>
          {err && <p className="text-sm text-red-500 font-semibold">{err}</p>}
          <button onClick={handleSend} disabled={!price || sending}
            className="btn-primary w-full py-3.5 justify-center rounded-xl disabled:opacity-50">
            {sending ? <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" /> : <><Send size={16} /> {t('supplierPanel.sendQuote')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Setup Tab: shop creation + specializations ── */
function SetupTab({ user, shop, onShopChange }: { user: any; shop: any; onShopChange: () => void }) {
  const { t } = useLanguage();
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
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [deletingShop, setDeletingShop] = useState(false);
  const [deleteErr, setDeleteErr] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi'];

  const loadAll = useCallback(async () => {
    const [sp, br, cats] = await Promise.all([
      shopsApi.getSpecializations().catch(() => []),
      shopsApi.brands().catch(() => []),
      shopsApi.categories().catch(() => []),
    ]);
    setSpecs(sp);
    setBrands(br);
    setAllCategories(cats);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (shop) {
      setShopForm({ name: shop.name || '', description: shop.description || '', city: shop.city || '', phone: shop.phone || '', address: shop.address || '' });
      setSelectedCats((shop.categories || []).map((c: any) => c.id));
    }
  }, [shop]);

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
      setShopMsg(t('supplierPanel.savedMsg'));
      onShopChange();
    } catch (err: any) {
      setShopMsg(err.message || t('supplierPanel.failedMsg'));
    } finally {
      setSavingShop(false);
      setTimeout(() => setShopMsg(''), 3000);
    }
  };

  const toggleVisibility = async () => {
    if (!shop) return;
    setTogglingVisibility(true);
    try {
      await shopsApi.update({ is_active: !shop.is_active });
      onShopChange();
    } finally {
      setTogglingVisibility(false);
    }
  };

  const handleDeleteShop = async () => {
    setDeletingShop(true); setDeleteErr('');
    try {
      await shopsApi.delete();
      setConfirmingDelete(false);
      onShopChange();
    } catch (err: any) {
      setDeleteErr(err.message || t('supplierPanel.failedDeleteShop'));
    } finally {
      setDeletingShop(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const { url } = await uploadsApi.upload(file);
      await shopsApi.update({ cover_image: url });
      onShopChange();
    } finally {
      setUploadingCover(false);
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
      setSpecErr(err.message || t('supplierPanel.failedMsg'));
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
      setCatsMsg(t('supplierPanel.savedMsg'));
    } catch (e: any) {
      setCatsMsg(e.message || t('supplierPanel.failedMsg'));
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
            <h3 className="font-black text-dark">{t('supplierPanel.carBrandSpecTitle')}</h3>
            <p className="text-sm text-muted mt-0.5">
              {t('supplierPanel.carBrandSpecDescPrefix')} <strong className="text-dark">{t('supplierPanel.carBrandSpecDescStrong')}</strong>
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
                <span>{s.brand?.name || `${t('search.brand')} #${s.brand_id}`}</span>
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
              <p className="font-bold text-dark">{t('supplierPanel.noSpecsYet')}</p>
              <p className="text-muted">{t('supplierPanel.noSpecsDesc')}</p>
            </div>
          </div>
        )}

        {/* Add new */}
        <div className="border border-teal-border rounded-xl p-4 bg-teal-wash/50">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">{t('supplierPanel.addBrandModelLabel')}</p>
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <div className="input-wrap">
                <select value={selBrand} onChange={(e) => setSelBrand(e.target.value)}
                  className="bg-white appearance-none">
                  <option value="">{t('supplierPanel.selectBrandRequired')}</option>
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
                  <option value="">{t('supplierPanel.allModelsOptional')}</option>
                  {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <span className="input-end"><ChevronDown size={13} /></span>
              </div>
            </div>
            <button onClick={addSpec} disabled={!selBrand || addingSpec}
              className="btn-teal px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              {addingSpec
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Plus size={15} /> {t('supplierPanel.addBtn')}</>
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
              <h3 className="font-black text-dark">{t('supplierPanel.partCategoriesTitle')}</h3>
              <p className="text-sm text-muted mt-0.5">{t('supplierPanel.partCategoriesDesc')}</p>
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
              {savingCats ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('supplierPanel.saveCategories')}
            </button>
            {!shop && <span className="text-xs text-muted">{t('supplierPanel.createShopFirstHint')}</span>}
            {catsMsg && (
              <span className={`text-sm font-semibold ${catsMsg === t('supplierPanel.savedMsg') ? 'text-teal' : 'text-red-500'}`}>{catsMsg}</span>
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
            <h3 className="font-black text-dark">{shop ? t('supplierPanel.editShopTitle') : t('supplierPanel.createShopTitle')}</h3>
            <p className="text-sm text-muted mt-0.5">{t('supplierPanel.storefrontDesc')}</p>
          </div>
        </div>
        {shop && (
          <div className="mb-5 flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-teal-wash border border-teal-border overflow-hidden flex items-center justify-center shrink-0">
              {shop.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveUploadUrl(shop.cover_image)} alt="" className="w-full h-full object-cover" />
              ) : (
                <Camera size={22} className="text-teal-border" />
              )}
            </div>
            <label className="btn-secondary px-4 py-2 text-sm cursor-pointer">
              {uploadingCover ? <span className="w-4 h-4 border-2 border-teal-border border-t-teal rounded-full animate-spin" /> : t('supplierPanel.uploadCoverPhoto')}
              <input type="file" accept="image/*" hidden disabled={uploadingCover}
                onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
            </label>
          </div>
        )}
        <form onSubmit={saveShop} className="space-y-4">
          <div>
            <label className="field-label">{t('supplierPanel.shopNameLabel')}</label>
            <div className="input-wrap">
              <input value={shopForm.name} onChange={(e) => setShopForm(p => ({ ...p, name: e.target.value }))}
                placeholder={t('auth.businessNamePlaceholder')} required />
            </div>
          </div>
          <div>
            <label className="field-label">{t('supplierPanel.descriptionLabel')}</label>
            <textarea value={shopForm.description}
              onChange={(e) => setShopForm(p => ({ ...p, description: e.target.value }))}
              placeholder={t('supplierPanel.specializeDescPlaceholder')} rows={2} className="input-base resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">{t('supplierPanel.cityRequired')}</label>
              <div className="input-wrap">
                <select value={shopForm.city} onChange={(e) => setShopForm(p => ({ ...p, city: e.target.value }))}
                  className="bg-white appearance-none" required>
                  <option value="">{t('dashboardRequest.selectCityOption')}</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <span className="input-end"><ChevronDown size={13} /></span>
              </div>
            </div>
            <div>
              <label className="field-label">{t('dashboardRequest.phoneLabelRequired')}</label>
              <div className="input-wrap">
                <input type="tel" value={shopForm.phone}
                  onChange={(e) => setShopForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+995 5XX XXX XXX" required />
              </div>
            </div>
          </div>
          <div>
            <label className="field-label">{t('supplierPanel.addressLabel')}</label>
            <div className="input-wrap">
              <input value={shopForm.address}
                onChange={(e) => setShopForm(p => ({ ...p, address: e.target.value }))}
                placeholder={t('supplierPanel.addressPlaceholder')} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={savingShop || !shopForm.name || !shopForm.city || !shopForm.phone}
              className="btn-teal px-8 disabled:opacity-50">
              {savingShop
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : shop ? t('supplierPanel.saveChanges') : t('supplierPanel.createShopBtn')
              }
            </button>
            {shopMsg && (
              <span className={`text-sm font-semibold ${shopMsg === t('supplierPanel.savedMsg') ? 'text-teal' : 'text-red-500'}`}>
                {shopMsg}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Visibility & Delete */}
      {shop && (
        <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
              {shop.is_active ? <Eye size={20} className="text-teal" /> : <EyeOff size={20} className="text-teal" />}
            </div>
            <div>
              <h3 className="font-black text-dark">{t('supplierPanel.shopVisibilityTitle')}</h3>
              <p className="text-sm text-muted mt-0.5">
                {shop.is_active ? t('supplierPanel.shopVisibleDesc') : t('supplierPanel.shopHiddenDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={toggleVisibility}
                className={`w-11 h-6 rounded-full transition-colors ${shop.is_active ? 'bg-teal' : 'bg-teal-border'} relative ${togglingVisibility ? 'opacity-50' : ''}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${shop.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-bold text-dark">{shop.is_active ? t('supplierPanel.enabled') : t('supplierPanel.disabled')}</span>
            </label>

            {!confirmingDelete ? (
              <button onClick={() => setConfirmingDelete(true)}
                className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                <Trash2 size={14} /> {t('supplierPanel.deleteShop')}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleDeleteShop} disabled={deletingShop}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50">
                  {deletingShop ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('supplierPanel.confirmDeleteBtn')}
                </button>
                <button onClick={() => { setConfirmingDelete(false); setDeleteErr(''); }} className="text-xs font-semibold text-muted hover:text-dark">
                  {t('common.cancel')}
                </button>
              </div>
            )}
          </div>
          {deleteErr && (
            <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>{deleteErr}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Inventory Tab: seller's parts (the "warehouse") ── */
function PartFormModal({ existing, categories, brands, onClose, onSaved }: {
  existing: any; categories: any[]; brands: any[]; onClose: () => void; onSaved: () => void;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState(existing?.name || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [price, setPrice] = useState(existing?.price ? String(existing.price) : '');
  const [condition, setCondition] = useState(existing?.condition || 'used');
  const [categoryId, setCategoryId] = useState(existing?.category_id ? String(existing.category_id) : '');
  const [brandId, setBrandId] = useState(existing?.brand_id ? String(existing.brand_id) : '');
  const [modelId, setModelId] = useState(existing?.model_id ? String(existing.model_id) : '');
  const [models, setModels] = useState<any[]>([]);
  const [year, setYear] = useState(existing?.year || '');
  const [partNumber, setPartNumber] = useState(existing?.part_number || '');
  const [stock, setStock] = useState(existing?.stock ? String(existing.stock) : '1');
  const [images, setImages] = useState<string[]>(existing?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!brandId) { setModels([]); return; }
    shopsApi.modelsByBrand(Number(brandId)).then(setModels).catch(() => []);
  }, [brandId]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 6 - images.length)) {
        const { url } = await uploadsApi.upload(file);
        setImages((prev) => [...prev, url]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr('');
    const dto = {
      name, description: description || undefined, price: Number(price), condition,
      category_id: categoryId ? Number(categoryId) : undefined,
      brand_id: brandId ? Number(brandId) : undefined,
      model_id: modelId ? Number(modelId) : undefined,
      year: year || undefined, part_number: partNumber || undefined,
      stock: Number(stock) || 1, images,
    };
    try {
      if (existing) await partsApi.update(existing.id, dto);
      else await partsApi.create(dto);
      onSaved();
    } catch (e: any) {
      setErr(e.message || t('supplierPanel.failedSavePart'));
    } finally {
      setSaving(false);
    }
  };

  const topCategories = categories.filter((c) => !c.parent_id);

  return (
    <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-7 card-shadow border border-teal-border my-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-dark text-lg">{existing ? t('supplierPanel.editPartTitle') : t('supplierPanel.addPartTitle')}</h3>
          <button onClick={onClose} className="text-muted hover:text-dark transition-colors p-1 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">{t('supplierPanel.partNameLabel')}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input-base" placeholder={t('supplierPanel.partNamePlaceholder')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">{t('supplierPanel.priceLabel')}</label>
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="input-base" />
            </div>
            <div>
              <label className="field-label">{t('supplierPanel.stockQtyLabel')}</label>
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">{t('supplierPanel.conditionRequired')}</label>
              <div className="input-wrap">
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className="bg-white appearance-none">
                  <option value="new">{t('product.new')}</option>
                  <option value="used">{t('product.used')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">{t('search.category')}</label>
              <div className="input-wrap">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="bg-white appearance-none">
                  <option value="">{t('supplierPanel.selectCategoryOption')}</option>
                  {topCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">{t('search.brand')}</label>
              <div className="input-wrap">
                <select value={brandId} onChange={(e) => { setBrandId(e.target.value); setModelId(''); }} className="bg-white appearance-none">
                  <option value="">{t('supplierPanel.anyOption')}</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">{t('request.model')}</label>
              <div className="input-wrap">
                <select value={modelId} onChange={(e) => setModelId(e.target.value)} disabled={!brandId} className="bg-white appearance-none disabled:opacity-50">
                  <option value="">{t('supplierPanel.anyOption')}</option>
                  {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">{t('request.year')}</label>
              <input value={year} onChange={(e) => setYear(e.target.value)} placeholder={t('supplierPanel.yearPlaceholder')} className="input-base" />
            </div>
          </div>
          <div>
            <label className="field-label">{t('supplierPanel.partNumberLabel')}</label>
            <input value={partNumber} onChange={(e) => setPartNumber(e.target.value)} className="input-base" placeholder={t('supplierPanel.optionalPlaceholder')} />
          </div>
          <div>
            <label className="field-label">{t('supplierPanel.descriptionLabel')}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input-base resize-none" />
          </div>
          <div>
            <label className="field-label">{t('supplierPanel.photosLabel')}</label>
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-teal-border rounded-xl p-5 text-center cursor-pointer hover:border-teal/50 hover:bg-teal-wash/50 transition-all">
              <Camera size={22} className="mx-auto mb-1.5 text-dark/30" />
              <p className="text-xs font-medium text-muted">{uploading ? t('request.uploading') : t('supplierPanel.clickUploadPhotos')}</p>
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
          {err && <p className="text-sm text-red-500 font-semibold">{err}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving || !name || !price} className="btn-primary flex-1 py-3 justify-center disabled:opacity-50">
              {saving ? <span className="w-4 h-4 border-2 border-dark/20 border-t-dark rounded-full animate-spin" /> : existing ? t('supplierPanel.saveChanges') : t('supplierPanel.addPartTitle')}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border-2 border-teal-border rounded-xl text-sm font-bold text-muted hover:border-teal hover:text-dark transition-colors">
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InventoryTab({ shop }: { shop: any }) {
  const { t } = useLanguage();
  const [parts, setParts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!shop) { setParts([]); setLoading(false); return; }
    setLoading(true);
    const [prts, cats, brs] = await Promise.all([
      partsApi.byShop(shop.id).catch(() => []),
      shopsApi.categories().catch(() => []),
      shopsApi.brands().catch(() => []),
    ]);
    setParts(prts); setCategories(cats); setBrands(brs);
    setLoading(false);
  }, [shop]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await partsApi.delete(id);
      setParts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  if (!shop) {
    return (
      <div className="text-center py-16 text-muted">
        <Layers size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-bold text-dark mb-1">{t('supplierPanel.createShopFirstTitle')}</p>
        <p className="text-sm">{t('supplierPanel.createShopFirstDesc')}</p>
      </div>
    );
  }

  return (
    <div>
      {formOpen && (
        <PartFormModal existing={editingPart} categories={categories} brands={brands}
          onClose={() => { setFormOpen(false); setEditingPart(null); }}
          onSaved={() => { setFormOpen(false); setEditingPart(null); load(); }} />
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-dark">{t('supplierPanel.myInventory')}</h2>
        <button onClick={() => { setEditingPart(null); setFormOpen(true); }} className="btn-primary py-2.5">
          <Plus size={16} /> {t('supplierPanel.addPartTitle')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="w-7 h-7 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
        </div>
      ) : parts.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Layers size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-dark mb-1">{t('supplierPanel.noPartsYet')}</p>
          <p className="text-sm mb-4">{t('supplierPanel.noPartsDesc')}</p>
          <button onClick={() => setFormOpen(true)} className="btn-teal">{t('supplierPanel.addFirstPart')}</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts.map((p) => {
            const img = p.images?.[0] ? resolveUploadUrl(p.images[0]) : '';
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-teal-border overflow-hidden card-shadow">
                <div className="h-32 bg-teal-wash flex items-center justify-center overflow-hidden">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={p.name} className="w-full h-full object-cover" />
                  ) : <span className="text-3xl">🔧</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-dark text-sm leading-tight mb-1 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-black text-teal">₾{Number(p.price).toFixed(0)}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-wash text-muted">{t('supplierPanel.stockLabel')}: {p.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingPart(p); setFormOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-teal-border text-xs font-bold text-muted hover:border-teal hover:text-teal transition-colors">
                      <Edit2 size={12} /> {t('common.edit')}
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-100 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                      {deletingId === p.id ? <span className="w-3 h-3 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" /> : <><Trash2 size={12} /> {t('common.delete')}</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SellerDashboard() {
  const router = useRouter();
  const { t } = useLanguage();

  const reqStatusConfig: Record<string, { label: string; color: string; dot: string }> = {
    open:      { label: t('supplierPanel.reqStatusNew'),    color: 'bg-teal/10 text-teal border-teal/20',         dot: 'bg-teal' },
    offered:   { label: t('supplierPanel.reqStatusQuoted'), color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    fulfilled: { label: t('dashboard.statusFulfilled'),     color: 'bg-teal/10 text-teal border-teal/20',         dot: 'bg-teal' },
    closed:    { label: t('dashboard.statusClosed'),        color: 'bg-slate-50 text-slate-400 border-slate-200', dot: 'bg-slate-400' },
  };

  const orderStatusConfig: Record<string, { label: string; color: string }> = {
    pending:   { label: t('dashboard.orderPending'),   color: 'bg-yellow/15 text-dark border-yellow/25' },
    accepted:  { label: t('dashboard.orderAccepted'),  color: 'bg-teal/10 text-teal border-teal/20' },
    paid:      { label: t('dashboard.orderPaid'),      color: 'bg-teal/10 text-teal border-teal/20' },
    completed: { label: t('dashboard.orderCompleted'), color: 'bg-teal/10 text-teal border-teal/20' },
    cancelled: { label: t('dashboard.orderCancelled'), color: 'bg-red-50 text-red-500 border-red-100' },
  };

  const offerStatusLabel: Record<string, string> = {
    pending: t('dashboard.orderPending'),
    accepted: t('dashboard.orderAccepted'),
    rejected: t('dashboardRequest.offerRejected'),
  };

  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<Tab>('setup');
  const [requests, setRequests] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quotingRequest, setQuotingRequest] = useState<any>(null);
  const [accepting, setAccepting] = useState<number | null>(null);
  const [dismissingId, setDismissingId] = useState<number | null>(null);

  const handleDismiss = async (requestId: number) => {
    setDismissingId(requestId);
    try {
      await requestsApi.dismiss(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } finally {
      setDismissingId(null);
    }
  };

  const loadShop = async () => {
    const sh = await shopsApi.myShop().catch(() => null);
    setShop(sh);
  };

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
    Promise.all([loadShop(), loadData()]).finally(() => setLoading(false));
  }, [router]);

  /* Live updates: refresh requests/orders in place when relevant events arrive, not just a toast */
  useSocketEvent('new-request', () => loadData());
  useSocketEvent('offer-accepted', () => loadData());

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
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <div>
              <p className="text-white/60 text-xs">{t('nav.sellerPanel')}</p>
              <h1 className="text-lg font-black text-white">{user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {newCount > 0 && (
              <span className="flex items-center gap-2 px-4 py-2 bg-white/15 text-white border border-white/20 rounded-xl text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-yellow animate-pulse" />
                {newCount} {t('supplierPanel.newRequestsCount')}
              </span>
            )}
            {pendingOrders > 0 && (
              <span className="flex items-center gap-2 px-3 py-2 bg-white/15 text-white border border-white/20 rounded-xl text-sm font-bold">
                <Package size={13} />
                {pendingOrders} {t('supplierPanel.pendingOrdersCount')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('supplierPanel.statNewRequests'),   value: String(newCount),    color: 'text-teal',      icon: MessageCircle },
            { label: t('supplierPanel.statPendingOrders'), value: String(pendingOrders), color: 'text-dark',    icon: Package },
            { label: t('supplierPanel.statCompleted'),     value: String(orders.filter(o => o.status === 'completed').length), color: 'text-teal-dark', icon: CheckCircle },
            { label: t('supplierPanel.statRevenue'),       value: `₾${totalRevenue.toFixed(0)}`, color: 'text-teal', icon: DollarSign },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <Icon size={18} className={`${color} opacity-60 mb-2`} />
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-teal-wash border border-teal-border rounded-xl p-1 mb-6 w-fit flex-wrap">
          {(['setup', 'inventory', 'requests', 'quotes', 'orders'] as Tab[]).map((tabKey) => (
            <button key={tabKey} onClick={() => setTab(tabKey)}
              className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${tab === tabKey ? 'bg-teal text-white' : 'text-muted hover:text-dark'}`}>
              {tabKey === 'requests' && newCount > 0 && <span className="w-2 h-2 rounded-full bg-yellow" />}
              {tabKey === 'orders' && pendingOrders > 0 && <span className="w-2 h-2 rounded-full bg-yellow" />}
              {tabKey === 'setup' ? t('supplierPanel.tabSetup')
                : tabKey === 'inventory' ? t('supplierPanel.tabInventory')
                : tabKey === 'requests' ? t('supplierPanel.tabRequests')
                : tabKey === 'quotes' ? t('supplierPanel.tabQuotes')
                : t('supplierPanel.tabOrders')}
            </button>
          ))}
        </div>

        {/* Setup Tab */}
        {tab === 'setup' && <SetupTab user={user} shop={shop} onShopChange={loadShop} />}

        {/* Inventory Tab */}
        {tab === 'inventory' && <InventoryTab shop={shop} />}

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
                    <p className="font-bold text-dark mb-1">{t('supplierPanel.noMatchingRequests')}</p>
                    <p className="text-sm mb-4">{t('supplierPanel.addBrandsHintPrefix')} <strong>{t('supplierPanel.addBrandsHintStrong')}</strong> {t('supplierPanel.addBrandsHintSuffix')}</p>
                    <button onClick={() => setTab('setup')} className="btn-teal">{t('supplierPanel.goToSetup')}</button>
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
                              {r.customer?.name} · {r.customer?.city || t('supplierPanel.unknownCity')} · {new Date(r.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted bg-teal-wash border border-teal-border rounded-lg px-3 py-2">
                              {r.description}
                            </p>
                            {(r.images || []).length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {r.images.map((url: string, i: number) => (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img key={i} src={resolveUploadUrl(url)} alt="" className="w-14 h-14 object-cover rounded-lg border border-teal-border" />
                                ))}
                              </div>
                            )}
                          </div>
                          {r.status === 'open' && (
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => setQuotingRequest(r)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal text-white text-sm font-bold rounded-xl hover:bg-teal-dark transition-colors">
                                <Send size={14} /> {t('supplierPanel.sendQuote')}
                              </button>
                              <button onClick={() => handleDismiss(r.id)} disabled={dismissingId === r.id}
                                title={t('supplierPanel.dontHavePart')}
                                className="flex items-center gap-1.5 px-3 py-2.5 border border-teal-border text-muted text-sm font-bold rounded-xl hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                                {dismissingId === r.id ? <span className="w-3.5 h-3.5 border-2 border-teal-border border-t-teal rounded-full animate-spin" /> : <X size={14} />}
                              </button>
                            </div>
                          )}
                          {r.status === 'offered' && (
                            <div className="shrink-0 text-sm text-muted font-semibold px-3 py-1.5 bg-teal-wash border border-teal-border rounded-lg">
                              {r.offers?.length || 0} {t('supplierPanel.offersSentSuffix')}
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
                    <p className="font-bold text-dark mb-1">{t('supplierPanel.noQuotesYet')}</p>
                    <p className="text-sm">{t('supplierPanel.noQuotesDesc')}</p>
                  </div>
                ) : (
                  requests.filter(r => (r.offers?.length || 0) > 0).flatMap((r) =>
                    (r.offers || []).map((offer: any) => (
                      <div key={offer.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-dark">{r.brand?.name} {r.model?.name}</h3>
                          <p className="text-sm text-muted">{t('supplierPanel.customerLabel')}: {r.customer?.name} · {new Date(offer.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-black text-teal">₾{Number(offer.price).toFixed(0)}</span>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${offer.status === 'accepted' ? 'bg-teal/10 text-teal border-teal/20' : offer.status === 'rejected' ? 'bg-red-50 text-red-400 border-red-100' : 'bg-yellow/15 text-dark border-yellow/25'}`}>
                            {offerStatusLabel[offer.status] || offer.status}
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
                    <p className="font-bold text-dark mb-1">{t('activity.noOrdersYet')}</p>
                    <p className="text-sm">{t('supplierPanel.noOrdersDesc2')}</p>
                  </div>
                ) : (
                  orders.map((o) => {
                    const sc = orderStatusConfig[o.status] || orderStatusConfig.pending;
                    return (
                      <div key={o.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-bold text-dark">{t('dashboard.orderHash')} #{o.id}</h3>
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sc.color}`}>{sc.label}</span>
                            </div>
                            <p className="text-sm text-muted">
                              {o.customer?.name || t('shopDetail.customerFallback')} · {o.delivery_city} · {o.items?.length || 0} {t('cart.itemPlural')} · {new Date(o.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-teal">₾{Number(o.total).toFixed(0)}</span>
                            {o.status === 'pending' && (
                              <button onClick={() => handleAcceptOrder(o.id)} disabled={accepting === o.id}
                                className="btn-teal py-2 px-4 text-sm disabled:opacity-60">
                                {accepting === o.id
                                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  : <><CheckCircle size={14} /> {t('supplierPanel.acceptBtn')}</>
                                }
                              </button>
                            )}
                            {o.status === 'accepted' && (
                              <span className="text-xs font-semibold px-3 py-1.5 bg-teal-wash border border-teal-border rounded-lg text-muted">
                                {t('supplierPanel.awaitingDeliveryConfirmation')}
                              </span>
                            )}
                            {o.status === 'completed' && (
                              <span className="text-xs font-semibold px-3 py-1.5 bg-teal/10 border border-teal/20 rounded-lg text-teal">
                                {t('supplierPanel.paymentReleasedCheck')} ✓
                              </span>
                            )}
                          </div>
                        </div>
                        {o.status === 'pending' && (
                          <div className="mt-3 flex items-start gap-2 bg-teal-wash border border-teal/20 rounded-xl p-3 text-sm text-muted">
                            <AlertCircle size={14} className="text-teal mt-0.5 shrink-0" />
                            <span>{t('supplierPanel.acceptShipDesc')}</span>
                          </div>
                        )}
                        {(o.items || []).length > 0 && (
                          <div className="mt-3 space-y-1">
                            {o.items.map((item: any) => (
                              <div key={item.id} className="flex items-center justify-between text-sm text-muted bg-teal-wash rounded-lg px-3 py-2">
                                <span className="font-semibold text-dark">{item.part?.name || t('supplierPanel.partFallback')}</span>
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
