'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Phone, Mail, MapPin, Globe2, MessageCircle, Rss } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const platformLinks = [
    { href: '/shops', label: t('footer.browseShops') },
    { href: '/parts', label: t('footer.findParts') },
    { href: '/request', label: t('footer.submitRequest') },
    { href: '/auth/register?role=shop', label: t('footer.openShop') },
    { href: '/auth/register?role=seller', label: t('footer.becomeSeller') },
  ];

  if (pathname?.startsWith('/auth/register')) return null;

  return (
    <footer style={{ background: 'var(--color-forest-green)' }} className="text-white">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
                <Car size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                partz<span className="text-white/90">.ge</span>
              </span>
            </Link>
            <p className="text-white/65 text-sm leading-relaxed mb-5">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-2.5">
              {[Globe2, MessageCircle, Rss].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-5">{t('footer.platform')}</h4>
            <ul className="space-y-3">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white/90 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-5">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={14} className="text-white/90 mt-0.5 shrink-0" />
                Tbilisi, Georgia
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={14} className="text-white/90 shrink-0" />
                +995 555 000 000
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={14} className="text-white/90 shrink-0" />
                info@partz.ge
              </li>
            </ul>
            <div className="mt-5 p-3.5 bg-white/10 rounded-xl">
              <p className="text-xs text-white/40 mb-0.5">{t('footer.workingHours')}</p>
              <p className="text-sm text-white font-semibold">{t('footer.workingHoursValue')}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">{t('footer.rights')}</p>
          <div className="flex gap-5">
            {[t('footer.privacy'), t('footer.terms'), t('footer.cookies')].map((item) => (
              <Link key={item} href="#" className="text-xs text-white/40 hover:text-white/90 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
