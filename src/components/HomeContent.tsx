'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Clock,
  Star,
  Truck,
  ChevronRight,
  TrendingUp,
  Zap,
  Search,
  CheckCircle,
} from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import ProductCard from '@/components/ProductCard';
import ShopCard from '@/components/ShopCard';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeContent({
  parts,
  shops,
  featuredProducts,
  featuredShops,
}: {
  parts: any[];
  shops: any[];
  featuredProducts: any[];
  featuredShops: any[];
}) {
  const { t } = useLanguage();

  const stats = [
    { label: t('home.statShops'), value: `${shops.length}+`, icon: Shield },
    { label: t('home.statParts'), value: `${parts.length}+`, icon: TrendingUp },
    {
      label: t('home.statVerifiedSellers'),
      value: `${shops.filter((s: any) => s.completed_orders_count > 0).length}+`,
      icon: Truck,
    },
  ];

  const avgRating = shops.length
    ? (shops.reduce((s: number, sh: any) => s + Number(sh.rating_avg || 0), 0) / shops.length).toFixed(1)
    : '—';
  const completedOrders = shops.reduce((s: number, sh: any) => s + Number(sh.completed_orders_count || 0), 0);

  const trustItems = [
    { icon: Shield, text: t('home.trustVerified') },
    { icon: Clock, text: t('home.trustFast') },
    { icon: Star, text: t('home.trustRated') },
  ];

  const steps = [
    { step: '01', title: t('home.step1Title'), desc: t('home.step1Desc'), bg: 'gradient-teal', textColor: 'text-white' },
    { step: '02', title: t('home.step2Title'), desc: t('home.step2Desc'), bg: 'bg-teal-wash border border-teal-border', textColor: 'text-teal' },
    { step: '03', title: t('home.step3Title'), desc: t('home.step3Desc'), bg: 'bg-teal-wash border border-teal-border', textColor: 'text-teal' },
  ];

  const aboutFeatures = [
    { label: t('home.featVin'), desc: t('home.featVinDesc') },
    { label: t('home.featRanked'), desc: t('home.featRankedDesc') },
    { label: t('home.featCompare'), desc: t('home.featCompareDesc') },
    { label: t('home.featNationwide'), desc: t('home.featNationwideDesc') },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="gradient-hero relative border-b border-teal-border min-h-[640px] lg:min-h-[700px]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal opacity-[0.06] blur-3xl" />
          <div className="absolute top-1/2 -left-16 w-72 h-72 rounded-full bg-teal opacity-[0.06] blur-3xl" />
          <div className="absolute -bottom-16 right-1/3 w-64 h-64 rounded-full bg-purple opacity-[0.05] blur-3xl" />
        </div>

        <div className="relative max-w-375 mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div className="lg:self-start lg:pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-teal text-xs font-bold uppercase tracking-wider mb-6 border border-teal-border bg-teal-wash">
                <Zap size={11} className="fill-teal" />
                {t('home.eyebrow')}
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-black text-dark leading-[1.1] mb-5">
                {t('home.titleLine1')}
                <span className="block text-teal">{t('home.titleLine2')}</span>
                <span className="relative">
                  {t('home.titleLine3')}
                  <span className="absolute -bottom-1 left-0 w-16 h-1.5 bg-yellow rounded-full" />
                </span>
              </h1>

              <p className="text-muted text-lg leading-relaxed mb-8 max-w-md">
                {t('home.lede')}
              </p>

              <div className="flex flex-wrap gap-5 mb-10">
                {trustItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted">
                    <Icon size={14} className="text-teal" />
                    {text}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {stats.map(({ label, value }) => (
                  <div key={label} className="bg-white border border-teal-border rounded-xl p-3.5 card-shadow">
                    <div className="text-xl font-black text-teal mb-0.5">{value}</div>
                    <div className="text-xs text-muted">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="self-start">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PARTS ── */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-teal-wash">
          <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-7">
              <div>
                <span className="section-label">{t('home.freshListings')}</span>
                <h2 className="text-2xl font-black text-dark">{t('home.latestParts')}</h2>
              </div>
              <Link href="/parts" className="flex items-center gap-1 text-sm font-bold text-teal hover:text-teal-dark transition-colors">
                {t('home.viewAll')} <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SHOPS ── */}
      {featuredShops.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-7">
              <div>
                <span className="section-label">{t('home.trustedPartners')}</span>
                <h2 className="text-2xl font-black text-dark">{t('home.topShops')}</h2>
              </div>
              <Link href="/shops" className="flex items-center gap-1 text-sm font-bold text-teal hover:text-teal-dark transition-colors">
                {t('home.allShops')} <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredShops.map((s) => (
                <ShopCard key={s.id} shop={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIVE ACTIVITY FEED ── */}
      <LiveActivityFeed />

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 bg-screen">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-11">
            <span className="inline-block px-3.5 py-1 bg-white/70 text-teal-dark font-bold text-xs tracking-widest uppercase rounded-full mb-3 border border-forest-green/15">{t('home.howItWorks')}</span>
            <h2 className="text-2xl font-black text-forest-green">{t('home.howTitle')}</h2>
            <p className="text-forest-green/70 mt-2 max-w-xl mx-auto text-sm">{t('home.howDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-lg text-center">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-5`}>
                  <span className={`text-xl font-black ${item.textColor}`}>{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-forest-green mb-3">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-14 bg-white">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-label">{t('home.aboutEyebrow')}</span>
              <h2 className="text-3xl font-black text-dark mb-5 leading-tight">{t('home.aboutTitle')}</h2>
              <p className="text-muted leading-relaxed mb-4">{t('home.aboutP1')}</p>
              <p className="text-muted leading-relaxed mb-7">{t('home.aboutP2')}</p>
              <div className="grid grid-cols-2 gap-4">
                {aboutFeatures.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-wash border border-teal-border flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={14} className="text-teal" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-dark">{item.label}</div>
                      <div className="text-xs text-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-teal-wash border border-teal-border rounded-2xl p-6 card-shadow">
                  <div className="text-3xl font-black text-teal mb-1">{parts.length}+</div>
                  <div className="text-sm font-semibold text-dark">{t('home.partsListed')}</div>
                  <div className="text-xs text-muted mt-0.5">{t('home.liveInventory')}</div>
                </div>
                <div className="gradient-teal rounded-2xl p-6 card-shadow">
                  <div className="text-3xl font-black text-white mb-1">{shops.length}+</div>
                  <div className="text-sm font-semibold text-white">{t('home.shopsLabel')}</div>
                  <div className="text-xs text-white/60 mt-0.5">{t('home.acrossGeorgia')}</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="gradient-purple rounded-2xl p-6 card-shadow">
                  <div className="text-3xl font-black text-white mb-1">{avgRating}</div>
                  <div className="text-sm font-semibold text-white">{t('home.avgRating')}</div>
                  <div className="text-xs text-white/70 mt-0.5">{t('home.outOf5')}</div>
                </div>
                <div className="bg-white border border-teal-border rounded-2xl p-6 card-shadow">
                  <div className="text-3xl font-black text-teal-dark mb-1">{completedOrders}</div>
                  <div className="text-sm font-semibold text-dark">{t('home.ordersCompleted')}</div>
                  <div className="text-xs text-muted mt-0.5">{t('home.paymentReleased')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-neutral-wash relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-forest-green mb-4">{t('home.ctaTitle')}</h2>
          <p className="text-forest-green/70 mb-8 text-lg">{t('home.ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/request" className="btn-teal text-base px-8 py-4">
              <Search size={18} />
              {t('home.ctaSubmit')}
            </Link>
            <Link
              href="/shops"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-forest-green border-2 border-forest-green/30 rounded-full hover:bg-forest-green/10 hover:border-forest-green/60 transition-all"
            >
              {t('home.ctaBrowse')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
