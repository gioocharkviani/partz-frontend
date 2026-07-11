'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ChevronRight, ShoppingBag, ArrowRight, Bell } from 'lucide-react';
import { shopsApi } from '@/lib/api';
import { useSocketEvent } from '@/lib/socket';

interface RequestActivity {
  id: number;
  brand?: string;
  model?: string;
  category?: string;
  status?: string;
  created_at: string;
}

interface OrderActivity {
  id: number;
  city?: string;
  total?: number;
  created_at: string;
}

function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LiveActivityFeed() {
  const [requests, setRequests] = useState<RequestActivity[]>([]);
  const [orders, setOrders] = useState<OrderActivity[]>([]);
  const [flashRequest, setFlashRequest] = useState(false);
  const [flashOrder, setFlashOrder] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    shopsApi.recentActivity()
      .then((data) => { setRequests(data.requests || []); setOrders(data.orders || []); })
      .catch(() => {});
  }, []);

  /* Re-render periodically so "X min ago" labels stay fresh */
  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const onNewRequest = useCallback((data: any) => {
    setFlashRequest(true);
    setTimeout(() => setFlashRequest(false), 700);
    setRequests((prev) => [data, ...prev].slice(0, 6));
  }, []);

  const onNewOrder = useCallback((data: any) => {
    setFlashOrder(true);
    setTimeout(() => setFlashOrder(false), 700);
    setOrders((prev) => [data, ...prev].slice(0, 5));
  }, []);

  const onRequestFulfilled = useCallback((data: any) => {
    setRequests((prev) => prev.map((r) => (r.id === data.requestId ? { ...r, status: 'fulfilled' } : r)));
  }, []);

  useSocketEvent('activity:new-request', onNewRequest);
  useSocketEvent('activity:new-order', onNewOrder);
  useSocketEvent('activity:request-fulfilled', onRequestFulfilled);

  return (
    <section className="py-14 bg-teal-wash border-y border-teal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-teal/10 border border-teal/20 rounded-full text-teal text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                Live Now
              </span>
            </div>
            <h2 className="text-2xl font-black text-dark">Platform Activity</h2>
            <p className="text-muted text-sm mt-1">Real requests and orders happening right now</p>
          </div>
          <Link href="/request" className="btn-primary shrink-0 self-start sm:self-auto">
            Post Your Request <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">

          {/* ── LIVE REQUESTS (3/5) ── */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={14} className="text-teal" />
              <h3 className="text-sm font-bold text-dark uppercase tracking-wider">Live Part Requests</h3>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white border border-dashed border-teal-border rounded-xl p-8 text-center text-sm text-muted">
                No requests yet — be the first to <Link href="/request" className="text-teal font-bold">post one</Link>.
              </div>
            ) : (
              <div className="space-y-2.5">
                {requests.map((req, i) => {
                  const fulfilled = req.status === 'fulfilled';
                  return (
                    <div
                      key={`${req.id}-${req.created_at}`}
                      className={`bg-white border rounded-xl p-4 transition-all ${fulfilled ? 'opacity-60' : ''} ${i === 0 && flashRequest ? 'border-teal bg-teal-wash' : 'border-teal-border'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-wash border border-teal-border flex items-center justify-center shrink-0 text-teal font-black text-xs">
                          {(req.brand || '?').slice(0, 3).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-sm font-bold text-dark">{req.brand || 'Vehicle'} {req.model || ''}</span>
                            {req.category && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-teal-wash text-teal border-teal-border shrink-0">
                                {req.category}
                              </span>
                            )}
                            {fulfilled && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20 shrink-0">
                                Sold
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted flex items-center gap-1">
                            <Clock size={10} /> {timeAgo(req.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (2/5) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Recent Orders */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={14} className="text-teal" />
                <h3 className="text-sm font-bold text-dark uppercase tracking-wider">Recent Orders</h3>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-dashed border-teal-border rounded-xl p-6 text-center text-sm text-muted">
                  No orders yet
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((order, i) => (
                    <div
                      key={`${order.id}-${order.created_at}`}
                      className={`bg-white border rounded-xl p-4 transition-all ${i === 0 && flashOrder ? 'border-teal bg-teal-wash' : 'border-teal-border'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <MapPin size={10} /> {order.city || 'Georgia'}
                        </span>
                        <span className="text-base font-black text-teal shrink-0">₾{Number(order.total || 0).toFixed(0)}</span>
                      </div>
                      <p className="text-xs text-subtle mt-1 flex items-center gap-0.5">
                        <Clock size={9} /> {timeAgo(order.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seller CTA */}
            <div className="bg-white border border-teal-border rounded-2xl p-5 card-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-xs font-bold text-teal uppercase tracking-wider">For Sellers</span>
              </div>
              <h4 className="text-base font-black text-dark mb-2 leading-snug">
                These customers need your help right now
              </h4>
              <p className="text-xs text-muted mb-4 leading-relaxed">
                Register as a seller and get a shop instantly — free, you only pay when you win business.
              </p>
              <Link href="/auth/register?role=seller" className="btn-teal w-full justify-center py-3 text-sm">
                Become a Seller <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
