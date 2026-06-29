'use client';

import { useState } from 'react';
import { MessageCircle, CheckCircle, XCircle, DollarSign, Send, ChevronRight } from 'lucide-react';

const incomingRequests = [
  { id: 1, part: 'BMW E46 Front Bumper OEM', vehicle: 'BMW 3 Series 2003', description: 'Looking for good condition bumper, minor scratches OK. OEM preferred.', customer: 'Giorgi M.', location: 'Tbilisi', time: '15 min ago', status: 'new', hasPhoto: true },
  { id: 2, part: 'Timing Belt Kit Ford Focus', vehicle: 'Ford Focus 2.0 2008', description: 'Complete kit with water pump. Must be new.', customer: 'David B.', location: 'Kutaisi', time: '1h ago', status: 'new', hasPhoto: false },
  { id: 3, part: 'Air Mass Sensor BMW E90', vehicle: 'BMW 318d 2008', description: 'Original Bosch preferred.', customer: 'Nino K.', location: 'Tbilisi', time: '3h ago', status: 'quoted', hasPhoto: false },
  { id: 4, part: 'Opel Astra H Gearbox', vehicle: 'Opel Astra H 2006', description: 'Complete 5-speed manual gearbox. Must be tested.', customer: 'Sandro L.', location: 'Rustavi', time: '5h ago', status: 'declined', hasPhoto: true },
];

const myQuotes = [
  { id: 1, part: 'BMW E90 Xenon Ballast', customer: 'Ana T.', price: 85, status: 'accepted', date: '2024-05-25' },
  { id: 2, part: 'Toyota Corolla Brake Disc Set', customer: 'Giorgi M.', price: 95, status: 'pending', date: '2024-05-26' },
  { id: 3, part: 'Audi A4 Rear Axle Shaft', customer: 'Irakli B.', price: 110, status: 'declined', date: '2024-05-24' },
];

const statusConfig = {
  new: { label: 'New', color: 'bg-teal/10 text-teal border-teal/20', dot: 'bg-teal' },
  quoted: { label: 'Quoted', color: 'bg-amber/20 text-dark border-amber/30', dot: 'bg-amber' },
  declined: { label: 'Declined', color: 'bg-red-50 text-red-400 border-red-100', dot: 'bg-red-400' },
};

type Tab = 'requests' | 'quotes' | 'analytics';

function QuoteModal({ request, onClose }: { request: typeof incomingRequests[0]; onClose: () => void }) {
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('used');
  const [delivery, setDelivery] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-7 card-shadow border border-teal-border">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-black text-dark text-lg">{request.part}</h3>
            <p className="text-sm text-muted">{request.vehicle}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-dark transition-colors p-1 text-lg leading-none">âœ•</button>
        </div>
        <div className="bg-teal-wash rounded-xl p-4 mb-5 text-sm text-muted border border-teal-border">
          <strong className="text-dark">Customer note:</strong> {request.description}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Your Price (â‚¾) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="input-base" />
            </div>
            <div>
              <label className="field-label">Delivery</label>
              <input value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="e.g. 1-2 days" className="input-base" />
            </div>
          </div>
          <div>
            <label className="field-label">Condition</label>
            <div className="flex gap-2">
              {['new', 'used', 'refurbished'].map((c) => (
                <button key={c} type="button" onClick={() => setCondition(c)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 transition-all capitalize ${condition === c ? 'bg-teal text-white border-teal' : 'border-teal-border text-muted hover:border-teal'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">Note to customer</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add details about the part..." className="input-base resize-none" />
          </div>
          <button onClick={handleSend} disabled={!price || sending} className="btn-primary w-full py-3.5 justify-center rounded-xl">
            {sending ? <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" /> : <><Send size={16} /> Send Quote</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const [tab, setTab] = useState<Tab>('requests');
  const [quotingRequest, setQuotingRequest] = useState<typeof incomingRequests[0] | null>(null);

  const newCount = incomingRequests.filter((r) => r.status === 'new').length;

  return (
    <div className="min-h-screen bg-white">
      {quotingRequest && <QuoteModal request={quotingRequest} onClose={() => setQuotingRequest(null)} />}

      <div className="gradient-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs">Dealer Dashboard</p>
            <h1 className="text-lg font-black text-white">GeoAutoSupply</h1>
          </div>
          {newCount > 0 && (
            <span className="flex items-center gap-2 px-4 py-2 bg-white/15 text-white border border-white/20 rounded-xl text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-yellow animate-pulse" />
              {newCount} new requests
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'New Requests', value: String(newCount), color: 'text-teal', icon: MessageCircle },
            { label: 'Quotes Sent', value: '18', color: 'text-dark', icon: Send },
            { label: 'Accepted', value: '11', color: 'text-teal-dark', icon: CheckCircle },
            { label: 'Revenue', value: 'â‚¾4,820', color: 'text-teal', icon: DollarSign },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <Icon size={18} className={`${color} opacity-60 mb-2`} />
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-teal-wash border border-teal-border rounded-xl p-1 mb-6 w-fit">
          {(['requests', 'quotes', 'analytics'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all capitalize flex items-center gap-1.5 ${tab === t ? 'bg-teal text-white' : 'text-muted hover:text-dark'}`}>
              {t === 'requests' && newCount > 0 && <span className="w-2 h-2 rounded-full bg-yellow" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'requests' && (
          <div className="space-y-4">
            {incomingRequests.map((r) => {
              const sc = statusConfig[r.status as keyof typeof statusConfig];
              return (
                <div key={r.id} className={`bg-white rounded-2xl p-5 card-shadow border border-l-4 ${r.status === 'new' ? 'border-teal-border border-l-teal' : r.status === 'quoted' ? 'border-teal-border border-l-amber' : 'border-teal-border border-l-red-300'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-dark">{r.part}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${sc.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                        {r.hasPhoto && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-wash border border-teal-border text-muted">ðŸ“· Photo</span>}
                      </div>
                      <p className="text-sm text-muted mb-2">{r.vehicle} Â· {r.location} Â· {r.time}</p>
                      <p className="text-sm text-muted bg-teal-wash border border-teal-border rounded-lg px-3 py-2 inline-block">{r.description}</p>
                    </div>
                    {r.status === 'new' && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setQuotingRequest(r)} className="flex items-center gap-1.5 px-4 py-2.5 bg-teal text-white text-sm font-bold rounded-xl hover:bg-teal-dark transition-colors">
                          <Send size={14} /> Quote
                        </button>
                        <button className="p-2.5 border-2 border-teal-border rounded-xl text-muted hover:border-red-300 hover:text-red-400 transition-colors">
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'quotes' && (
          <div className="space-y-3">
            {myQuotes.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl p-5 card-shadow border border-teal-border flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-dark">{q.part}</h3>
                  <p className="text-sm text-muted">Customer: {q.customer} Â· {q.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-teal">â‚¾{q.price}</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${q.status === 'accepted' ? 'bg-teal/10 text-teal border-teal/20' : q.status === 'pending' ? 'bg-amber/15 text-dark border-amber/25' : 'bg-red-50 text-red-400 border-red-100'}`}>
                    {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'analytics' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: 'Quote Acceptance Rate', value: '61%', sub: '11 of 18 quotes accepted', dark: true },
              { label: 'Avg Response Time', value: '18 min', sub: 'Target: under 30 min', dark: false },
              { label: 'Customer Rating', value: '4.7 â˜…', sub: 'Based on 42 reviews', yellow: true },
              { label: 'This Month Revenue', value: 'â‚¾1,840', sub: '+23% vs last month', dark: true },
              { label: 'Requests Received', value: '62', sub: 'In the last 30 days', dark: false },
              { label: 'Top Category', value: 'Electrical', sub: '38% of all requests', dark: true },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl p-6 card-shadow ${item.yellow ? 'gradient-yellow border border-amber/30' : item.dark ? 'gradient-teal' : 'bg-white border border-teal-border'}`}>
                <div className={`text-2xl font-black mb-1 ${item.yellow ? 'text-dark' : item.dark ? 'text-yellow' : 'text-teal'}`}>{item.value}</div>
                <div className={`text-sm font-bold mb-1 ${item.yellow || !item.dark ? 'text-dark' : 'text-white'}`}>{item.label}</div>
                <div className={`text-xs ${item.yellow ? 'text-dark/60' : item.dark ? 'text-white/60' : 'text-muted'}`}>{item.sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

