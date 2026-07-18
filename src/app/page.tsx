import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Clock,
  Star,
  Truck,
  ChevronRight,
  TrendingUp,
  Users,
  Zap,
  Search,
  CheckCircle,
} from "lucide-react";
import SearchForm from "@/components/SearchForm";
import ProductCard from "@/components/ProductCard";
import ShopCard from "@/components/ShopCard";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import { partsApi, shopsApi } from "@/lib/api";
import { toProductCard, toShopCard } from "@/lib/mappers";

const categories = [
  { name: 'Engine Parts', icon: '⚙️' },
  { name: 'Brakes', icon: '🛑' },
  { name: 'Suspension', icon: '🔧' },
  { name: 'Body & Exterior', icon: '🚗' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Transmission', icon: '🔩' },
  { name: 'Filters', icon: '💧' },
  { name: 'Tyres', icon: '🎯' },
];

>>>>>>> parent of 60eb08e (fise)
export default async function HomePage() {
  const [parts, shops] = await Promise.all([
    partsApi.search({}).catch(() => []),
    shopsApi.list({ sort: 'ranking' }).catch(() => []),
  ]);

  const featuredProducts = parts.slice(0, 8).map(toProductCard);
  const featuredShops = shops.slice(0, 4).map(toShopCard);

<<<<<<< HEAD
  return (
    <HomeContent
      parts={parts}
      shops={shops}
      featuredProducts={featuredProducts}
      featuredShops={featuredShops}
    />
=======
  const stats = [
    { label: 'Shops on Platform', value: `${shops.length}+`, icon: Shield },
    { label: 'Parts Listed', value: `${parts.length}+`, icon: TrendingUp },
    { label: 'Verified Sellers', value: `${shops.filter((s: any) => s.completed_orders_count > 0).length}+`, icon: Truck },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="gradient-hero relative border-b border-teal-border min-h-[640px] lg:min-h-[700px]">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal opacity-[0.06] blur-3xl" />
          <div className="absolute top-1/2 -left-16 w-72 h-72 rounded-full bg-teal opacity-[0.06] blur-3xl" />
          <div className="absolute -bottom-16 right-1/3 w-64 h-64 rounded-full bg-purple opacity-[0.05] blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* Left copy */}
            <div className="lg:self-center lg:pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-teal text-xs font-bold uppercase tracking-wider mb-6 border border-teal-border bg-teal-wash">
                <Zap size={11} className="fill-teal" />
                Georgia&apos;s Car Parts Marketplace
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-black text-dark leading-[1.1] mb-5">
                Find the Right
                <span className="block text-teal">Car Part,</span>
                <span className="relative">
                  Fast.
                  <span className="absolute -bottom-1 left-0 w-16 h-1.5 bg-yellow rounded-full" />
                </span>
              </h1>

              <p className="text-muted text-lg leading-relaxed mb-8 max-w-md">
                Search by VIN or select your vehicle. Connect with verified shops and sellers across Georgia. Get offers in minutes.
              </p>

              <div className="flex flex-wrap gap-5 mb-10">
                {[
                  { icon: Shield, text: 'Verified sellers' },
                  { icon: Clock, text: 'Quick responses' },
                  { icon: Star, text: 'Rated reviews' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted">
                    <Icon size={14} className="text-teal" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map(({ label, value }) => (
                  <div key={label} className="bg-white border border-teal-border rounded-xl p-3.5 card-shadow">
                    <div className="text-xl font-black text-teal mb-0.5">{value}</div>
                    <div className="text-xs text-muted">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search form */}
            <div className="self-start">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <span className="section-label">Browse by Category</span>
            <h2 className="text-2xl font-black text-dark">What are you looking for?</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/parts?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white border border-teal-border rounded-xl p-3 sm:p-4 text-center card-shadow card-shadow-hover hover:border-teal"
              >
                <div className="text-2xl sm:text-3xl mb-1.5">{cat.icon}</div>
                <div className="text-xs font-bold text-dark group-hover:text-teal transition-colors leading-tight">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PARTS ── */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-teal-wash">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-7">
              <div>
                <span className="section-label">Fresh Listings</span>
                <h2 className="text-2xl font-black text-dark">Latest Parts</h2>
              </div>
              <Link href="/parts" className="flex items-center gap-1 text-sm font-bold text-teal hover:text-teal-dark transition-colors">
                View All <ChevronRight size={15} />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-7">
              <div>
                <span className="section-label">Trusted Partners</span>
                <h2 className="text-2xl font-black text-dark">Top-Ranked Shops</h2>
              </div>
              <Link href="/shops" className="flex items-center gap-1 text-sm font-bold text-teal hover:text-teal-dark transition-colors">
                All Shops <ChevronRight size={15} />
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
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-11">
            <span className="section-label">Simple Process</span>
            <h2 className="text-2xl font-black text-dark">How partz.ge Works</h2>
            <p className="text-muted mt-2 max-w-xl mx-auto text-sm">Find exactly what you need in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Describe Your Need', desc: 'Enter VIN or select your vehicle. Add a description and photos of the damaged part.', bg: 'gradient-teal', textColor: 'text-white' },
              { step: '02', title: 'Get Offers', desc: 'Verified sellers who specialize in your car brand see your request and send competitive price offers.', bg: 'bg-teal-wash border border-teal-border', textColor: 'text-teal' },
              { step: '03', title: 'Order & Receive', desc: 'Choose the best offer, pay securely, and get your part delivered or pick it up.', bg: 'bg-teal-wash border border-teal-border', textColor: 'text-teal' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 card-shadow border border-teal-border text-center hover:border-teal transition-colors">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-5`}>
                  <span className={`text-xl font-black ${item.textColor}`}>{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-label">About partz.ge</span>
              <h2 className="text-3xl font-black text-dark mb-5 leading-tight">
                Georgia&apos;s Smart Way to Buy &amp; Sell Car Parts
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                partz.ge connects car owners with a nationwide network of verified shops, dealers, and independent sellers. Whether you need a rare OEM component or an affordable aftermarket part, our platform makes finding it simple.
              </p>
              <p className="text-muted leading-relaxed mb-7">
                Sellers manage their own inventory and receive targeted part requests directly from customers. Customers compare prices and condition, then buy with confidence.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'VIN Decoder', desc: 'Auto-detect vehicle specs' },
                  { label: 'Ranked Sellers', desc: 'Rated by speed & reliability' },
                  { label: 'Price Compare', desc: 'Get multiple offers' },
                  { label: 'Nationwide', desc: 'Delivery across Georgia' },
                ].map((item) => (
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
                  <div className="text-sm font-semibold text-dark">Parts Listed</div>
                  <div className="text-xs text-muted mt-0.5">Live inventory</div>
                </div>
                <div className="gradient-teal rounded-2xl p-6 card-shadow">
                  <div className="text-3xl font-black text-white mb-1">{shops.length}+</div>
                  <div className="text-sm font-semibold text-white">Shops</div>
                  <div className="text-xs text-white/60 mt-0.5">Across Georgia</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="gradient-purple rounded-2xl p-6 card-shadow">
                  <div className="text-3xl font-black text-white mb-1">
                    {shops.length ? (shops.reduce((s: number, sh: any) => s + Number(sh.rating_avg || 0), 0) / shops.length).toFixed(1) : '—'}
                  </div>
                  <div className="text-sm font-semibold text-white">Avg. Shop Rating</div>
                  <div className="text-xs text-white/70 mt-0.5">Out of 5</div>
                </div>
                <div className="bg-white border border-teal-border rounded-2xl p-6 card-shadow">
                  <div className="text-3xl font-black text-teal-dark mb-1">
                    {shops.reduce((s: number, sh: any) => s + Number(sh.completed_orders_count || 0), 0)}
                  </div>
                  <div className="text-sm font-semibold text-dark">Orders Completed</div>
                  <div className="text-xs text-muted mt-0.5">Payment released on delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 gradient-teal relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-light opacity-10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            Ready to find your part?
          </h2>
          <p className="text-white/75 mb-8 text-lg">
            Submit a free request and get offers from verified Georgian sellers within minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/request" className="btn-primary text-base px-8 py-4">
              <Search size={18} />
              Submit Request
            </Link>
            <Link href="/shops" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 hover:border-white/60 transition-all">
              Browse Shops <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
>>>>>>> parent of 60eb08e (fise)
  );
}
