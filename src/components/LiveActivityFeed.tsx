'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ChevronRight, ShoppingBag, ArrowRight, Bell } from 'lucide-react';

interface Request {
  id: number;
  part: string;
  brand: string;
  model: string;
  year: string;
  location: string;
  ago: string;
  offerCount: number;
  hasPhoto: boolean;
  category: string;
}

interface Order {
  id: number;
  part: string;
  shop: string;
  price: number;
  buyer: string;
  ago: string;
  condition: 'new' | 'used' | 'refurbished';
}

const ALL_REQUESTS: Request[] = [
  { id: 1, part: 'Front Bumper OEM', brand: 'BMW', model: '3 Series (E46)', year: '2003', location: 'Tbilisi', ago: '1 min ago', offerCount: 4, hasPhoto: true, category: 'Body' },
  { id: 2, part: 'Timing Belt Kit', brand: 'Ford', model: 'Focus 2.0', year: '2008', location: 'Kutaisi', ago: '3 min ago', offerCount: 2, hasPhoto: false, category: 'Engine' },
  { id: 3, part: 'Right Headlight', brand: 'Mercedes', model: 'E220 (W211)', year: '2007', location: 'Tbilisi', ago: '5 min ago', offerCount: 6, hasPhoto: true, category: 'Lighting' },
  { id: 4, part: 'Air Mass Sensor', brand: 'BMW', model: '318d (E90)', year: '2009', location: 'Rustavi', ago: '7 min ago', offerCount: 3, hasPhoto: false, category: 'Electrical' },
  { id: 5, part: 'Rear Axle Shaft', brand: 'Audi', model: 'A4 B7', year: '2006', location: 'Batumi', ago: '9 min ago', offerCount: 1, hasPhoto: false, category: 'Suspension' },
  { id: 6, part: 'Brake Disc Set', brand: 'Toyota', model: 'Corolla', year: '2015', location: 'Tbilisi', ago: '11 min ago', offerCount: 5, hasPhoto: true, category: 'Brakes' },
  { id: 7, part: 'Gearbox ECU', brand: 'VW', model: 'Golf V', year: '2005', location: 'Gori', ago: '14 min ago', offerCount: 2, hasPhoto: false, category: 'Electrical' },
  { id: 8, part: 'Engine Mount Set', brand: 'Opel', model: 'Astra H', year: '2006', location: 'Tbilisi', ago: '18 min ago', offerCount: 3, hasPhoto: true, category: 'Engine' },
  { id: 9, part: 'Front Shock Absorbers', brand: 'Honda', model: 'CR-V', year: '2012', location: 'Tbilisi', ago: '22 min ago', offerCount: 4, hasPhoto: false, category: 'Suspension' },
  { id: 10, part: 'Alternator 90A', brand: 'Renault', model: 'Megane II', year: '2005', location: 'Kutaisi', ago: '25 min ago', offerCount: 2, hasPhoto: false, category: 'Electrical' },
];

const ALL_ORDERS: Order[] = [
  { id: 1, part: 'BMW E90 Xenon Ballast', shop: 'AutoParts Tbilisi', price: 85, buyer: 'Giorgi M.', ago: 'Just now', condition: 'refurbished' },
  { id: 2, part: 'Brake Disc Set Toyota', shop: 'BrakeMaster GE', price: 95, buyer: 'Nino K.', ago: '4 min ago', condition: 'new' },
  { id: 3, part: 'Bosch Alternator 120A', shop: 'ElectroParts GE', price: 185, buyer: 'David B.', ago: '9 min ago', condition: 'new' },
  { id: 4, part: 'Opel Astra Engine Mount', shop: 'CheapParts GE', price: 45, buyer: 'Sandro L.', ago: '15 min ago', condition: 'new' },
  { id: 5, part: 'VW Golf Gearbox ECU', shop: 'AutoParts Tbilisi', price: 150, buyer: 'Ana T.', ago: '20 min ago', condition: 'used' },
  { id: 6, part: 'Audi A4 Rear Axle Shaft', shop: 'GermanParts Pro', price: 110, buyer: 'Irakli B.', ago: '28 min ago', condition: 'used' },
  { id: 7, part: 'Toyota Air Filter Set', shop: 'JapanAuto GE', price: 38, buyer: 'Mariam G.', ago: '35 min ago', condition: 'new' },
  { id: 8, part: 'Ford Focus Timing Belt', shop: 'FordSpecialist GE', price: 68, buyer: 'Levan T.', ago: '42 min ago', condition: 'new' },
];

const conditionBadge = {
  new: 'bg-teal/10 text-teal border-teal/20',
  used: 'bg-teal-wash text-muted border-teal-border',
  refurbished: 'bg-teal/5 text-teal-dark border-teal/15',
};

const categoryColor: Record<string, string> = {
  Body: 'bg-teal-wash text-teal-dark border-teal-border',
  Engine: 'bg-teal/10 text-teal border-teal/20',
  Electrical: 'bg-teal/10 text-teal-dark border-teal/20',
  Lighting: 'bg-teal-wash text-teal border-teal-border',
  Suspension: 'bg-teal-wash text-teal border-teal-border',
  Brakes: 'bg-red-50 text-red-500 border-red-100',
  Transmission: 'bg-teal-wash text-teal-dark border-teal-border',
};

export default function LiveActivityFeed() {
  const [visibleRequests, setVisibleRequests] = useState<Request[]>(ALL_REQUESTS.slice(0, 5));
  const [visibleOrders, setVisibleOrders] = useState<Order[]>(ALL_ORDERS.slice(0, 4));
  const [newRequestIdx, setNewRequestIdx] = useState(5);
  const [newOrderIdx, setNewOrderIdx] = useState(4);
  const [flashRequest, setFlashRequest] = useState(false);
  const [flashOrder, setFlashOrder] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFlashRequest(true);
      setTimeout(() => setFlashRequest(false), 700);
      setNewRequestIdx((prev) => {
        const next = prev % ALL_REQUESTS.length;
        const newItem = { ...ALL_REQUESTS[next], ago: 'Just now' };
        setVisibleRequests((cur) => [newItem, ...cur.slice(0, 4)]);
        return next + 1;
      });
    }, 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFlashOrder(true);
      setTimeout(() => setFlashOrder(false), 700);
      setNewOrderIdx((prev) => {
        const next = prev % ALL_ORDERS.length;
        const newItem = { ...ALL_ORDERS[next], ago: 'Just now' };
        setVisibleOrders((cur) => [newItem, ...cur.slice(0, 3)]);
        return next + 1;
      });
    }, 9000);
    return () => clearInterval(id);
  }, []);

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
            <p className="text-muted text-sm mt-1">Real-time requests and orders happening right now</p>
          </div>
          <Link href="/request" className="btn-primary shrink-0 self-start sm:self-auto">
            Post Your Request <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">

          {/* â”€â”€ LIVE REQUESTS (3/5) â”€â”€ */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-teal" />
                <h3 className="text-sm font-bold text-dark uppercase tracking-wider">Live Part Requests</h3>
                <span className="text-xs font-bold text-white bg-teal px-2 py-0.5 rounded-full">
                  {ALL_REQUESTS.length} today
                </span>
              </div>
              <Link href="/request" className="text-xs font-bold text-teal hover:text-teal-dark transition-colors flex items-center gap-0.5">
                View all <ChevronRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {visibleRequests.map((req, i) => (
                <div
                  key={`${req.id}-${i}`}
                  className={`group bg-white border rounded-xl p-4 hover:border-teal hover:shadow-sm transition-all cursor-pointer ${i === 0 && flashRequest ? 'border-teal bg-teal-wash' : 'border-teal-border'}`}
                  style={{ animation: i === 0 ? 'fadeInUp 0.4s ease forwards' : undefined }}
                >
                  <div className="flex items-start gap-3">
                    {/* Brand tag */}
                    <div className="w-10 h-10 rounded-xl bg-teal-wash border border-teal-border flex items-center justify-center shrink-0 text-teal font-black text-xs">
                      {req.brand.slice(0, 3).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-bold text-dark">{req.part}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${categoryColor[req.category] || 'bg-teal-wash text-teal border-teal-border'}`}>
                          {req.category}
                        </span>
                        {req.hasPhoto && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-teal/10 border border-teal/20 shrink-0">ðŸ“·</span>
                        )}
                      </div>
                      <p className="text-xs text-muted">
                        {req.brand} {req.model} Â· {req.year}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {req.offerCount > 0 ? (
                        <span className="block text-xs font-bold text-teal bg-teal/10 border border-teal/20 px-2 py-1 rounded-lg mb-1">
                          {req.offerCount} offers
                        </span>
                      ) : (
                        <span className="block text-xs text-subtle mb-1">Waitingâ€¦</span>
                      )}
                      <div className="flex items-center gap-1 justify-end text-xs text-subtle">
                        <Clock size={10} />
                        {req.ago}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-teal-border">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <MapPin size={10} /> {req.location}
                    </span>
                    <span className="ml-auto text-xs font-bold text-teal opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Send Quote <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* â”€â”€ RIGHT COLUMN (2/5) â”€â”€ */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Recent Orders */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-teal" />
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wider">Recent Orders</h3>
                </div>
                <span className="text-xs text-muted">{ALL_ORDERS.length} today</span>
              </div>

              <div className="space-y-2.5">
                {visibleOrders.map((order, i) => (
                  <div
                    key={`${order.id}-${i}`}
                    className={`bg-white border rounded-xl p-4 transition-all ${i === 0 && flashOrder ? 'border-teal bg-teal-wash' : 'border-teal-border'}`}
                    style={{ animation: i === 0 ? 'fadeInUp 0.4s ease forwards' : undefined }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-bold text-dark leading-tight line-clamp-1">{order.part}</p>
                      <span className="text-base font-black text-teal shrink-0">â‚¾{order.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted">{order.shop}</p>
                        <p className="text-xs text-subtle mt-0.5">by {order.buyer}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${conditionBadge[order.condition]}`}>
                          {order.condition}
                        </span>
                        <span className="text-xs text-subtle flex items-center gap-0.5">
                          <Clock size={9} /> {order.ago}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                Join 320+ verified Sellers receiving live part requests. Free to register â€” you only pay when you win business.
              </p>
              <Link href="/auth/register?role=Seller" className="btn-teal w-full justify-center py-3 text-sm">
                Become a Seller <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

