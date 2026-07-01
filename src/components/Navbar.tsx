'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Car, Search, User, LogIn, Store, Truck, ShoppingCart, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getUser, logout } from '@/lib/api';

const navLinks = [
  { href: '/shops', label: 'Shops' },
  { href: '/parts', label: 'Parts' },
  { href: '/request', label: 'Find a Part' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { count } = useCart();

  /* Re-read on every route change so login/logout reflects immediately */
  useEffect(() => {
    setCurrentUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  const isSeller = currentUser?.role === 'seller';

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
              <Link key={link.href} href={link.href}
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-teal rounded-lg hover:bg-teal-wash transition-all">
                {link.label}
              </Link>
            ))}

            {/* Register dropdown — only for guests */}
            {!currentUser && (
              <div className="relative ml-1">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-muted hover:text-teal rounded-lg hover:bg-teal-wash transition-all">
                  Register
                  <ChevronDown size={13} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-teal-border z-20">
                      <Link href="/auth/register?role=shop" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-teal-wash transition-colors group">
                        <div className="w-8 h-8 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors text-teal">
                          <Store size={14} />
                        </div>
                        <div>
                          <div className="font-bold leading-tight">Open a Shop</div>
                          <div className="text-xs text-muted">Sell your parts</div>
                        </div>
                      </Link>
                      <Link href="/auth/register?role=seller" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-teal-wash transition-colors group">
                        <div className="w-8 h-8 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors text-teal">
                          <Truck size={14} />
                        </div>
                        <div>
                          <div className="font-bold leading-tight">Become Seller</div>
                          <div className="text-xs text-muted">Receive requests</div>
                        </div>
                      </Link>
                      <Link href="/auth/register" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-teal-wash transition-colors group">
                        <div className="w-8 h-8 rounded-xl bg-teal-border flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors text-muted">
                          <User size={14} />
                        </div>
                        <div>
                          <div className="font-bold leading-tight">Buyer Account</div>
                          <div className="text-xs text-muted">Buy & request parts</div>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/parts" className="p-2 text-muted hover:text-teal hover:bg-teal-wash rounded-lg transition-colors">
              <Search size={17} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-muted hover:text-teal hover:bg-teal-wash rounded-lg transition-colors">
              <ShoppingCart size={17} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {currentUser ? (
              /* Logged-in user menu */
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-teal-border hover:border-teal hover:bg-teal-wash transition-all">
                  <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">{currentUser.name?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-dark leading-tight max-w-[80px] truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-muted capitalize leading-tight">{currentUser.role}</div>
                  </div>
                  <ChevronDown size={12} className={`text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-teal-border z-20">
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-teal-wash transition-colors">
                        <LayoutDashboard size={15} className="text-teal" />
                        <span className="font-semibold">Dashboard</span>
                      </Link>
                      {isSeller && (
                        <Link href="/dashboard/supplier" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-teal-wash transition-colors">
                          <Store size={15} className="text-teal" />
                          <span className="font-semibold">Seller Panel</span>
                        </Link>
                      )}
                      <div className="border-t border-teal-border my-1" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={15} />
                        <span className="font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Guest buttons */
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-muted hover:text-teal hover:bg-teal-wash rounded-lg transition-colors border border-teal-border">
                  <User size={14} /> Dashboard
                </Link>
                <Link href="/auth/login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-teal rounded-lg hover:bg-teal-dark transition-colors">
                  <LogIn size={14} /> Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart" className="relative p-2 text-dark rounded-lg hover:bg-teal-wash transition-colors">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-dark rounded-lg hover:bg-teal-wash transition-colors">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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
              {currentUser ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-black">{currentUser.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div>
                      <div className="font-black text-dark text-sm">{currentUser.name}</div>
                      <div className="text-xs text-muted capitalize">{currentUser.role}</div>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-teal border border-teal-border rounded-xl hover:bg-teal-wash transition-colors">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  {isSeller && (
                    <Link href="/dashboard/supplier" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-teal border border-teal-border rounded-xl hover:bg-teal-wash transition-colors">
                      <Store size={15} /> Seller Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-teal rounded-xl">
                    <LogIn size={15} /> Sign In
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-teal border border-teal-border rounded-xl hover:bg-teal-wash transition-colors">
                    <User size={15} /> Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
