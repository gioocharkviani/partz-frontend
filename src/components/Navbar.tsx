'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Car, Search, User, LogIn, Store, Truck } from 'lucide-react';

const navLinks = [
  { href: '/shops', label: 'Shops' },
  { href: '/parts', label: 'Parts' },
  { href: '/request', label: 'Find a Part' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-teal-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <span className="text-xl font-black text-dark tracking-tight">
              partz<span className="text-teal">.ge</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-teal rounded-lg hover:bg-teal-wash transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Register dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-muted hover:text-teal rounded-lg hover:bg-teal-wash transition-all"
              >
                Register
                <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-teal-border z-20">
                    <Link href="/auth/register?role=shop" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-teal-wash transition-colors group">
                      <div className="w-8 h-8 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors text-teal">
                        <Store size={14} />
                      </div>
                      <div>
                        <div className="font-bold leading-tight">Open a Shop</div>
                        <div className="text-xs text-muted">Sell your parts</div>
                      </div>
                    </Link>
                    <Link href="/auth/register?role=Seller" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-teal-wash transition-colors group">
                      <div className="w-8 h-8 rounded-xl bg-amber/20 flex items-center justify-center group-hover:bg-amber transition-colors text-dark">
                        <Truck size={14} />
                      </div>
                      <div>
                        <div className="font-bold leading-tight">Become Seller</div>
                        <div className="text-xs text-muted">Receive requests</div>
                      </div>
                    </Link>
                    <Link href="/auth/register?role=customer" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-teal-wash transition-colors group">
                      <div className="w-8 h-8 rounded-xl bg-teal-border flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors text-muted">
                        <User size={14} />
                      </div>
                      <div>
                        <div className="font-bold leading-tight">Customer Account</div>
                        <div className="text-xs text-muted">Buy & request parts</div>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/request" className="p-2 text-muted hover:text-teal hover:bg-teal-wash rounded-lg transition-colors">
              <Search size={17} />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-muted hover:text-teal hover:bg-teal-wash rounded-lg transition-colors border border-teal-border">
              <User size={14} />
              Dashboard
            </Link>
            <Link href="/auth/login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-teal rounded-lg hover:bg-teal-dark transition-colors">
              <LogIn size={14} />
              Sign In
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-dark rounded-lg hover:bg-teal-wash transition-colors">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-teal-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-muted hover:text-teal hover:bg-teal-wash rounded-xl transition-all">
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-teal-border mt-2 space-y-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-teal rounded-xl hover:bg-teal-dark transition-colors">
                <LogIn size={15} /> Sign In
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-teal border border-teal-border rounded-xl hover:bg-teal-wash transition-colors">
                <User size={15} /> Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


