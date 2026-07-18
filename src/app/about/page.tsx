'use client';

import Link from 'next/link';
import { Shield, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, title: t('aboutPage.feat1Title'), desc: t('aboutPage.feat1Desc') },
    { icon: Zap, title: t('aboutPage.feat2Title'), desc: t('aboutPage.feat2Desc') },
    { icon: Users, title: t('aboutPage.feat3Title'), desc: t('aboutPage.feat3Desc') },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">{t('aboutPage.eyebrow')}</span>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">{t('aboutPage.title')}</h1>
          <p className="text-white/75 leading-relaxed max-w-2xl mx-auto">
            {t('aboutPage.lede')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          <div>
            <h2 className="text-xl font-black text-dark mb-3">{t('aboutPage.howWorksTitle')}</h2>
            <p className="text-muted leading-relaxed">
              {t('aboutPage.howWorksDesc')}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black text-dark mb-3">{t('aboutPage.forSellersTitle')}</h2>
            <p className="text-muted leading-relaxed">
              {t('aboutPage.forSellersDesc')}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-teal-wash border border-teal-border rounded-2xl p-5">
              <Icon size={20} className="text-teal mb-3" />
              <h3 className="font-bold text-dark text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-teal-border rounded-2xl p-8 text-center card-shadow">
          <CheckCircle size={28} className="text-teal mx-auto mb-3" />
          <h2 className="text-xl font-black text-dark mb-2">{t('aboutPage.ctaTitle')}</h2>
          <p className="text-muted text-sm mb-6">{t('aboutPage.ctaDesc')}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/request" className="btn-primary">{t('aboutPage.ctaFind')} <ArrowRight size={15} /></Link>
            <Link href="/auth/register?role=seller" className="btn-teal">{t('aboutPage.ctaSeller')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
