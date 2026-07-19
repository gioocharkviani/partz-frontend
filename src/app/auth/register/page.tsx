'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Car, ShoppingBag, Store, Check, Eye, EyeOff, MapPin, Phone, Mail, User, Building2 } from 'lucide-react';
import { authApi, saveAuth } from '@/lib/api';
import { refreshSocketAuth } from '@/lib/socket';
import { useLanguage } from '@/context/LanguageContext';

type Role = 'customer' | 'seller';

interface FormData {
  businessName: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const EMPTY_FORM: FormData = {
  businessName: '', name: '', email: '', phone: '', city: '', password: '', confirmPassword: '', terms: false,
};

const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi', 'Akhaltsikhe', 'Ozurgeti'];

function RegisterPanel({ role, emphasized }: { role: Role; emphasized: boolean }) {
  const router = useRouter();
  const { t } = useLanguage();
  const isSeller = role === 'seller';

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState('');
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const set = (k: keyof FormData, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const canSubmit = form.name && form.email && form.password && form.terms && (!isSeller || form.businessName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setApiError('');
    setSubmitting(true);
    try {
      const res = await authApi.register({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        role,
        city: form.city || undefined,
        businessName: isSeller ? form.businessName : undefined,
      });
      saveAuth(res.access_token, res.user);
      refreshSocketAuth();
      setDone(true);
    } catch (err: any) {
      setApiError(err.message || t('auth.registerFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const Icon = isSeller ? Store : ShoppingBag;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-16">
        <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mb-5">
          <Check size={36} className="text-teal" />
        </div>
        <h2 className="text-2xl font-black text-dark mb-2">{t('auth.accountCreated')}</h2>
        <p className="text-muted mb-6 max-w-xs">
          {isSeller ? t('auth.welcomeSeller') : t('auth.welcomeCustomer')}
        </p>
        <button onClick={() => router.push(isSeller ? '/dashboard/supplier' : '/parts')} className="btn-teal">
          {isSeller ? t('auth.setupShop') : t('auth.browseParts')}
        </button>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col justify-center transition-all ${emphasized ? 'scale-[1.01]' : ''}`}>
      <div className="mb-7">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isSeller ? 'bg-purple/10 text-purple' : 'bg-teal/10 text-teal'}`}>
          <Icon size={22} />
        </div>
        <h2 className="text-xl font-black text-dark mb-1">{isSeller ? t('registerPage.sellerHeading') : t('registerPage.customerHeading')}</h2>
        <p className="text-sm text-muted">{isSeller ? t('registerPage.sellerDesc') : t('registerPage.customerDesc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSeller && (
          <div>
            <label className="field-label">{t('auth.businessName')} *</label>
            <div className="input-wrap">
              <span className="input-icon"><Building2 size={14} /></span>
              <input value={form.businessName} onChange={(e) => set('businessName', e.target.value)}
                placeholder={t('auth.businessNamePlaceholder')} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">{t('auth.fullName')} *</label>
            <div className="input-wrap">
              <span className="input-icon"><User size={14} /></span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder={t('auth.fullNamePlaceholder')} />
            </div>
          </div>
          <div>
            <label className="field-label">{t('auth.city')}</label>
            <div className="input-wrap">
              <span className="input-icon"><MapPin size={14} /></span>
              <select value={form.city} onChange={(e) => set('city', e.target.value)}
                className="bg-white appearance-none">
                <option value="">{t('auth.selectCity')}</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="field-label">{t('auth.email')} *</label>
          <div className="input-wrap">
            <span className="input-icon"><Mail size={14} /></span>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
              placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <label className="field-label">{t('auth.phone')}</label>
          <div className="input-wrap">
            <span className="input-icon"><Phone size={14} /></span>
            <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
              placeholder="+995 5XX XXX XXX" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">{t('auth.password')} *</label>
            <div className="input-wrap">
              <input type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder={t('auth.minChars')} className="pl-4" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-end hover:text-dark transition-colors">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="field-label">{t('auth.confirmPassword')} *</label>
            <div className="input-wrap">
              <input type="password" value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                placeholder={t('auth.repeat')} className="pl-4" />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)}
            className="mt-1 accent-teal" />
          <span className="text-sm text-muted">
            {t('auth.agreeTermsPrefix')}{' '}
            <Link href="/terms" className="text-teal font-semibold hover:underline">{t('auth.termsLink')}</Link>{' '}{t('auth.andWord')}{' '}
            <Link href="/privacy" className="text-teal font-semibold hover:underline">{t('auth.privacyLink')}</Link>
          </span>
        </label>

        {apiError && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
            {apiError}
          </div>
        )}

        <button type="submit" disabled={!canSubmit || submitting}
          className={`w-full justify-center flex items-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isSeller ? 'bg-purple hover:bg-purple-dark' : 'bg-teal hover:bg-teal-dark'}`}>
          {submitting
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : (isSeller ? t('auth.createSellerAccount') : t('auth.createCustomerAccount'))}
        </button>
      </form>
    </div>
  );
}

function RegisterLayout() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const prefillRole = searchParams.get('role');
  const sellerFirst = prefillRole === 'seller' || prefillRole === 'shop';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Minimal header — logo only */}
      <header className="border-b border-teal-border py-4 shrink-0">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span className="text-xl font-black text-dark">partz<span className="text-teal">.ge</span></span>
          </Link>
        </div>
      </header>

      {/* Two-panel registration */}
      <div className="flex-1 grid md:grid-cols-2 relative">
        <div className={`p-8 sm:p-12 lg:p-16 md:border-r border-teal-border flex ${sellerFirst ? 'md:order-2' : ''}`}>
          <RegisterPanel role="customer" emphasized={!sellerFirst} />
        </div>

        {/* Divider badge */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-teal-border items-center justify-center text-xs font-black text-subtle shadow-sm">
          {t('registerPage.or')}
        </div>

        <div className={`p-8 sm:p-12 lg:p-16 bg-purple-wash/40 flex ${sellerFirst ? 'md:order-1' : ''}`}>
          <RegisterPanel role="seller" emphasized={sellerFirst} />
        </div>
      </div>

      <p className="text-center text-sm text-muted py-6 border-t border-teal-border">
        {t('auth.haveAccount')}{' '}
        <Link href="/auth/login" className="text-teal font-bold hover:text-teal-dark">{t('auth.loginHere')}</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-7 h-7 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
      </div>
    }>
      <RegisterLayout />
    </Suspense>
  );
}
