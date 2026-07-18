'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Car, ShoppingBag, Store, Check, Eye, EyeOff, MapPin, Phone, Mail, User, Building2 } from 'lucide-react';
import { authApi, saveAuth } from '@/lib/api';
import { refreshSocketAuth } from '@/lib/socket';
import { useLanguage } from '@/context/LanguageContext';

type UserType = 'customer' | 'seller' | null;

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  businessName: string;
  terms: boolean;
}

const CITIES = ['Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi', 'Akhaltsikhe', 'Ozurgeti'];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const prefillRole = searchParams.get('role');

  const [userType, setUserType] = useState<UserType>(
    prefillRole === 'seller' || prefillRole === 'shop' ? 'seller' : null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    city: '', businessName: '', terms: false,
  });

  const set = (k: keyof FormData, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setApiError('');
    setSubmitting(true);
    try {
      const res = await authApi.register({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        role: userType as 'customer' | 'seller',
        city: form.city || undefined,
        businessName: userType === 'seller' ? form.businessName : undefined,
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

  const canSubmit = form.name && form.email && form.password && form.terms &&
    (userType === 'customer' || form.businessName);

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto mb-5">
          <Check size={36} className="text-teal" />
        </div>
        <h2 className="text-2xl font-black text-dark mb-2">{t('auth.accountCreated')}</h2>
        <p className="text-muted mb-6">
          {userType === 'customer' ? t('auth.welcomeCustomer') : t('auth.welcomeSeller')}
        </p>
        <button onClick={() => router.push(userType === 'customer' ? '/parts' : '/dashboard/supplier')} className="btn-teal">
          {userType === 'customer' ? t('auth.browseParts') : t('auth.setupShop')}
        </button>
      </div>
    );
  }

  /* -- Step 1: pick type -- */
  if (!userType) {
    return (
      <div>
        <h2 className="text-2xl font-black text-dark mb-2 text-center">{t('auth.registerTitle')}</h2>
        <p className="text-muted text-sm text-center mb-8">{t('auth.chooseType')}</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setUserType('customer')}
            className="group p-6 rounded-2xl border-2 border-teal-border hover:border-teal hover:bg-teal-wash transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
              <ShoppingBag size={24} className="text-teal" />
            </div>
            <h3 className="text-lg font-black text-dark mb-1">{t('auth.customerTitle')}</h3>
            <p className="text-sm text-muted">{t('auth.customerDesc')}</p>
          </button>
          <button
            onClick={() => setUserType('seller')}
            className="group p-6 rounded-2xl border-2 border-teal-border hover:border-teal hover:bg-teal-wash transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
              <Store size={24} className="text-teal" />
            </div>
            <h3 className="text-lg font-black text-dark mb-1">{t('auth.sellerTitle')}</h3>
            <p className="text-sm text-muted">{t('auth.sellerDesc')}</p>
          </button>
        </div>
        <p className="text-center text-sm text-muted">
          {t('auth.haveAccount')}{' '}
          <Link href="/auth/login" className="text-teal font-bold hover:text-teal-dark">{t('auth.loginHere')}</Link>
        </p>
      </div>
    );
  }

  /* -- Registration form -- */
  return (
    <div>
      {/* Type switcher */}
      <div className="flex gap-2 p-1 bg-teal-wash rounded-xl border border-teal-border mb-6">
        {(['customer', 'seller'] as UserType[]).map((ut) => (
          <button key={ut!} onClick={() => setUserType(ut)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-black transition-all ${userType === ut ? 'bg-white text-teal shadow-sm border border-teal-border' : 'text-muted hover:text-dark'}`}>
            {ut === 'customer' ? <ShoppingBag size={14} /> : <Store size={14} />}
            {ut === 'customer' ? t('auth.customerTitle') : t('auth.sellerTitle')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {userType === 'seller' && (
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

        <button onClick={handleSubmit} disabled={!canSubmit || submitting}
          className="btn-teal w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          {submitting
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : (userType === 'customer' ? t('auth.createCustomerAccount') : t('auth.createSellerAccount'))}
        </button>
      </div>

      <p className="text-center text-sm text-muted mt-5">
        {t('auth.haveAccount')}{' '}
        <Link href="/auth/login" className="text-teal font-bold hover:text-teal-dark">{t('auth.loginHere')}</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-teal-wash flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
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
