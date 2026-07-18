'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package, Clock, CheckCircle, XCircle, ChevronRight, Plus, Bell,
  Store, ShoppingBag, ArrowRight, LogIn, AlertCircle,
} from 'lucide-react';
import { getUser, ordersApi, requestsApi } from '@/lib/api';
import { useSocketEvent } from '@/lib/socket';
import { useLanguage } from '@/context/LanguageContext';

type Tab = 'requests' | 'orders';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    open:      { label: t('dashboard.statusOpen'),     color: 'bg-yellow/15 text-dark border-yellow/25',    icon: Clock },
    offered:   { label: t('dashboard.statusOffered'),  color: 'bg-teal/10 text-teal border-teal/20',        icon: Bell },
    fulfilled: { label: t('dashboard.statusFulfilled'), color: 'bg-teal/10 text-teal border-teal/20',       icon: CheckCircle },
    closed:    { label: t('dashboard.statusClosed'),   color: 'bg-slate-50 text-slate-400 border-slate-200', icon: XCircle },
  };

  const orderStatusConfig: Record<string, { label: string; color: string }> = {
    pending:   { label: t('dashboard.orderPending'),   color: 'bg-yellow/15 text-dark border-yellow/25' },
    accepted:  { label: t('dashboard.orderAccepted'),  color: 'bg-teal/10 text-teal border-teal/20' },
    paid:      { label: t('dashboard.orderPaid'),      color: 'bg-teal/10 text-teal border-teal/20' },
    completed: { label: t('dashboard.orderCompleted'), color: 'bg-teal/10 text-teal border-teal/20' },
    cancelled: { label: t('dashboard.orderCancelled'), color: 'bg-red-50 text-red-500 border-red-100' },
  };

  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<number | null>(null);

  const loadData = () => Promise.all([
    requestsApi.myRequests().catch(() => []),
    ordersApi.myOrders().catch(() => []),
  ]).then(([reqs, ords]) => {
    setRequests(reqs);
    setOrders(ords);
  });

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    loadData().finally(() => setLoading(false));
  }, [router]);

  /* Live updates: refresh in place when sellers respond, without a manual reload */
  useSocketEvent('offer-received', () => loadData());
  useSocketEvent('order-accepted', () => loadData());

  const handleCompleteOrder = async (orderId: number) => {
    setCompleting(orderId);
    try {
      await ordersApi.completeOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
    } finally {
      setCompleting(null);
    }
  };

  if (!user) return null;

  const isSeller = user.role === 'seller';
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s: number, o: any) => s + Number(o.total || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="gradient-teal py-6">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">{t('nav.dashboard')}</p>
            <h1 className="text-xl font-black text-white">{user.name}</h1>
            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
              {isSeller ? <><Store size={11} /> {t('auth.sellerTitle')}</> : <><ShoppingBag size={11} /> {t('auth.customerTitle')}</>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isSeller && (
              <Link href="/request" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-bold rounded-xl transition-all">
                <Plus size={16} /> {t('request.newRequest')}
              </Link>
            )}
            {isSeller && (
              <Link href="/dashboard/supplier" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-bold rounded-xl transition-all">
                <Store size={16} /> {t('nav.sellerPanel')} <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Seller: no shop yet prompt */}
        {isSeller && (
          <div className="mb-8 rounded-2xl border-2 border-dashed border-teal-border bg-teal-wash p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
              <Store size={28} className="text-teal" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-black text-dark text-lg mb-1">{t('dashboard.sellerDashboardTitle')}</h3>
              <p className="text-muted text-sm">{t('dashboard.sellerDashboardDesc')}</p>
            </div>
            <Link href="/dashboard/supplier" className="btn-primary shrink-0 whitespace-nowrap">
              <Store size={16} /> {t('dashboard.openSellerPanel')} <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Stats — customer only */}
        {!isSeller && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: t('dashboard.statActiveRequests'), value: String(requests.filter(r => r.status === 'open' || r.status === 'offered').length), color: 'text-teal' },
              { label: t('dashboard.statOffersReceived'), value: String(requests.reduce((s: number, r: any) => s + (r.offers?.length || 0), 0)), color: 'text-teal-dark' },
              { label: t('dashboard.statTotalOrders'), value: String(orders.length), color: 'text-dark' },
              { label: t('dashboard.statTotalSpent'), value: `₾${totalSpent.toFixed(0)}`, color: 'text-teal' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs — customer only */}
        {!isSeller && (
          <>
            <div className="flex gap-1 bg-teal-wash border border-teal-border rounded-xl p-1 w-fit mb-6">
              {(['requests', 'orders'] as Tab[]).map((tabKey) => (
                <button key={tabKey} onClick={() => setTab(tabKey)}
                  className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all capitalize ${tab === tabKey ? 'bg-teal text-white' : 'text-muted hover:text-dark'}`}>
                  {tabKey === 'requests' ? t('dashboard.tabRequests') : t('dashboard.tabOrders')}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="w-7 h-7 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {tab === 'requests' && (
                  <div className="space-y-3">
                    {requests.length === 0 ? (
                      <div className="text-center py-16 text-muted">
                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-bold text-dark mb-1">{t('dashboard.noRequestsYet')}</p>
                        <p className="text-sm mb-4">{t('dashboard.noRequestsDesc')}</p>
                        <Link href="/request" className="btn-teal">{t('request.newRequest')}</Link>
                      </div>
                    ) : (
                      requests.map((r) => {
                        const sc = statusConfig[r.status] || statusConfig.open;
                        const Icon = sc.icon;
                        return (
                          <div key={r.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-dark truncate">
                                  {r.brand?.name} {r.model?.name} {r.year && `(${r.year})`} — {r.description?.slice(0, 40)}
                                </h3>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${sc.color}`}>
                                  <Icon size={10} /> {sc.label}
                                </span>
                              </div>
                              <p className="text-sm text-muted">{r.category?.name || t('dashboard.generalCategory')} · {new Date(r.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {(r.offers?.length || 0) > 0 && (
                                <span className="text-sm font-bold text-teal bg-teal/10 border border-teal/20 px-3 py-1.5 rounded-lg">
                                  {r.offers.length} {t('dashboard.offersCount')}
                                </span>
                              )}
                              <Link href={`/dashboard/requests/${r.id}`} className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-dark transition-colors">
                                {t('product.view')} <ChevronRight size={15} />
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {tab === 'orders' && (
                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <div className="text-center py-16 text-muted">
                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-bold text-dark mb-1">{t('activity.noOrdersYet')}</p>
                        <p className="text-sm mb-4">{t('dashboard.noOrdersDesc')}</p>
                        <Link href="/parts" className="btn-teal">{t('cart.browseParts')}</Link>
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
                                <p className="text-sm text-muted">{o.items?.length || 0} {t('cart.itemPlural')} · {o.delivery_city} · {new Date(o.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-black text-teal">₾{Number(o.total).toFixed(0)}</span>
                                {o.status === 'accepted' && (
                                  <button
                                    onClick={() => handleCompleteOrder(o.id)}
                                    disabled={completing === o.id}
                                    className="btn-teal py-2 px-4 text-sm disabled:opacity-60"
                                  >
                                    {completing === o.id
                                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                      : <><CheckCircle size={14} /> {t('dashboard.confirmDelivery')}</>
                                    }
                                  </button>
                                )}
                              </div>
                            </div>
                            {o.status === 'accepted' && (
                              <div className="mt-3 flex items-start gap-2 bg-teal-wash border border-teal/20 rounded-xl p-3 text-sm text-muted">
                                <AlertCircle size={14} className="text-teal mt-0.5 shrink-0" />
                                <span>{t('dashboard.confirmDeliveryHintPrefix')} <strong className="text-dark">{t('dashboard.confirmDelivery')}</strong> {t('dashboard.confirmDeliveryHintSuffix')}</span>
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
          </>
        )}

        {/* Seller: redirect hint */}
        {isSeller && !loading && (
          <div className="text-center py-8 text-muted">
            <Store size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold text-dark mb-1">{t('dashboard.youAreSeller')}</p>
            <p className="text-sm mb-4">{t('dashboard.sellerRedirectDesc')}</p>
            <Link href="/dashboard/supplier" className="btn-teal">{t('dashboard.openSellerPanel')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
