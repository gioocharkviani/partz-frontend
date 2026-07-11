import { Mail, MessageSquare } from 'lucide-react';

const SUPPORT_EMAIL = 'gioocharkviani@gmail.com';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-teal py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">Contact</span>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">Get in Touch</h1>
          <p className="text-white/75 leading-relaxed max-w-xl mx-auto">
            Questions about an order, your shop, or the platform? Reach out and we&apos;ll get back to you.
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
              <h3 className="font-bold text-dark mb-1">Email Support</h3>
              <p className="text-sm text-muted mb-1">For order issues, account questions, or general support.</p>
              <span className="text-sm font-bold text-teal">{SUPPORT_EMAIL}</span>
            </div>
          </a>

          <div className="bg-teal-wash border border-teal-border rounded-2xl p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
              <MessageSquare size={20} className="text-teal" />
            </div>
            <div>
              <h3 className="font-bold text-dark mb-1">Order &amp; Offer Questions</h3>
              <p className="text-sm text-muted">Already have an order or request in progress? Message the seller directly from your dashboard for the fastest response.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
