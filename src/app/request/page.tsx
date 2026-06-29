import SearchForm from '@/components/SearchForm';
import { Shield, Clock, Users, CheckCircle } from 'lucide-react';

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">Free Service</span>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">Find Your Car Part</h1>
            <p className="text-white/75 leading-relaxed">
              Tell us what you need â€” our network of 320+ verified sellers will send you competitive offers within minutes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <SearchForm />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 card-shadow border border-teal-border">
              <h3 className="font-black text-dark mb-4">How it works</h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Fill in the form with your vehicle details and the part you need' },
                  { step: '2', text: 'Your request is sent to verified sellers and Sellers' },
                  { step: '3', text: 'You receive competitive offers with prices and delivery times' },
                  { step: '4', text: 'Choose the best offer and complete your order securely' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{item.step}</div>
                    <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-teal rounded-2xl p-6 card-shadow">
              <h3 className="font-black text-white mb-4">Why partz.ge?</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'All sellers are verified' },
                  { icon: Clock, text: 'Get offers within minutes' },
                  { icon: Users, text: '320+ active sellers' },
                  { icon: CheckCircle, text: 'Buyer protection guaranteed' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-white/75">
                    <Icon size={14} className="text-yellow shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-yellow rounded-2xl p-6 border border-amber/30">
              <h3 className="font-black text-dark mb-2">Can&apos;t find what you need?</h3>
              <p className="text-sm text-muted mb-4">Our team can help you locate even rare OEM parts.</p>
              <a href="tel:+995555000000" className="btn-primary w-full justify-center py-3">
                Call Us Now
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

