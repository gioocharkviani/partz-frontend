'use client';

import { Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SUPPORT_EMAIL = 'gioocharkviani@gmail.com';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">{t('contactPage.eyebrow')}</span>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">{t('contactPage.title')}</h1>
          <p className="text-white/75 leading-relaxed max-w-xl mx-auto">
            {t('contactPage.lede')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 gap-5">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="bg-white border border-teal-border rounded-2xl p-6 card-shadow card-shadow-hover flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-teal" />
            </div>
            <div>
              <h3 className="font-bold text-dark mb-1">{t('contactPage.emailTitle')}</h3>
              <p className="text-sm text-muted mb-1">{t('contactPage.emailDesc')}</p>
              <span className="text-sm font-bold text-teal">{SUPPORT_EMAIL}</span>
            </div>
          </a>

          <div className="bg-teal-wash border border-teal-border rounded-2xl p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
              <MessageSquare size={20} className="text-teal" />
            </div>
            <div>
              <h3 className="font-bold text-dark mb-1">{t('contactPage.orderTitle')}</h3>
              <p className="text-sm text-muted">{t('contactPage.orderDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
