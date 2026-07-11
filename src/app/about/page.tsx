import Link from 'next/link';
import { Shield, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">About partz.ge</span>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">Georgia&apos;s Smart Way to Buy &amp; Sell Car Parts</h1>
          <p className="text-white/75 leading-relaxed max-w-2xl mx-auto">
            We connect car owners with a nationwide network of verified shops, dealers, and independent sellers — so finding the right part is fast, transparent, and reliable.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          <div>
            <h2 className="text-xl font-black text-dark mb-3">How it works</h2>
            <p className="text-muted leading-relaxed">
              Describe the part you need — by VIN, brand, or model — and sellers who specialize in that vehicle are notified instantly. You compare offers on price and condition, choose the best one, and pay with confidence: your payment is held by partz.ge until you confirm delivery.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black text-dark mb-3">For sellers</h2>
            <p className="text-muted leading-relaxed">
              Registering as a seller gives you a shop instantly — manage your inventory, set the car brands you specialize in, and receive targeted requests from buyers looking for exactly what you sell. Sellers are ranked by rating, response speed, and fulfillment reliability.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {[
            { icon: Shield, title: 'Buyer Protection', desc: 'Payment is only released to the seller after you confirm delivery.' },
            { icon: Zap, title: 'Fast Matching', desc: 'Only sellers who specialize in your car brand see your request.' },
            { icon: Users, title: 'Open Marketplace', desc: 'Anyone can register as a customer or seller — no gatekeeping.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-teal-wash border border-teal-border rounded-2xl p-5">
              <Icon size={20} className="text-teal mb-3" />
              <h3 className="font-bold text-dark text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-teal-border rounded-2xl p-8 text-center card-shadow">
          <CheckCircle size={28} className="text-teal mx-auto mb-3" />
          <h2 className="text-xl font-black text-dark mb-2">Ready to get started?</h2>
          <p className="text-muted text-sm mb-6">Whether you&apos;re looking for a part or want to sell one, it takes a minute to sign up.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/request" className="btn-primary">Find a Part <ArrowRight size={15} /></Link>
            <Link href="/auth/register?role=seller" className="btn-teal">Become a Seller</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
