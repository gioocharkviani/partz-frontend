"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Car,
  Store,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getUser, logout } from "@/lib/api";
import { useSocketEvent, refreshSocketAuth } from "@/lib/socket";
import { useLanguage } from "@/context/LanguageContext";

interface Notification {
  id: string;
  text: string;
  href: string;
  time: number;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { count } = useCart();

  const navLinks = [
    { href: "/shops", label: t("nav.shops") },
    { href: "/parts", label: t("nav.parts") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    setCurrentUser(getUser());
  }, [pathname]);

  const pushNotification = (n: Omit<Notification, "id" | "time">) => {
    setNotifications((prev) =>
      [
        { ...n, id: `${Date.now()}-${Math.random()}`, time: Date.now() },
        ...prev,
      ].slice(0, 20),
    );
  };

  useSocketEvent("new-request", () =>
    pushNotification({
      text: t("nav.notifNewRequest"),
      href: "/dashboard/supplier",
    }),
  );
  useSocketEvent("offer-received", () =>
    pushNotification({
      text: t("nav.notifOfferReceived"),
      href: "/dashboard",
    }),
  );
  useSocketEvent("offer-accepted", () =>
    pushNotification({
      text: t("nav.notifOfferAccepted"),
      href: "/dashboard/supplier",
    }),
  );
  useSocketEvent("order-accepted", () =>
    pushNotification({
      text: t("nav.notifOrderAccepted"),
      href: "/dashboard",
    }),
  );

  const handleLogout = () => {
    logout();
    refreshSocketAuth();
    setCurrentUser(null);
    setNotifications([]);
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const isSeller = currentUser?.role === "seller";

  const LangSwitcher = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex items-center rounded-full border border-teal-border bg-teal-wash p-0.5 ${compact ? "" : ""}`}>
      {(["ka", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${
            locale === l ? "bg-teal text-white" : "text-muted hover:text-dark"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  if (pathname?.startsWith("/auth/register")) return null;

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between h-14 px-3 sm:px-5 rounded-full border border-teal-border shadow-sm bg-white">
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
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-muted hover:text-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <LangSwitcher />

            {/* Notifications */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-muted hover:text-teal hover:bg-teal-wash rounded-full transition-colors"
                >
                  <Bell size={17} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setNotifOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl py-2 border border-teal-border z-20">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-muted text-center">
                          {t("nav.noNotifications")}
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.href}
                            onClick={() => {
                              setNotifOpen(false);
                            }}
                            className="flex items-start gap-3 px-4 py-3 text-sm text-dark hover:bg-teal-wash transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-purple mt-1.5 shrink-0" />
                            <span>{n.text}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-muted hover:text-teal hover:bg-teal-wash rounded-full transition-colors"
            >
              <ShoppingCart size={17} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {currentUser ? (
              /* Logged-in user menu */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-teal-border hover:border-teal hover:bg-teal-wash transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">
                      {currentUser.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-dark leading-tight max-w-[80px] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-muted capitalize leading-tight">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown
                    size={12}
                    className={`text-muted transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-teal-border z-20">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-teal-wash transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-teal" />
                        <span className="font-semibold">{t("nav.dashboard")}</span>
                      </Link>
                      {isSeller && (
                        <Link
                          href="/dashboard/supplier"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-teal-wash transition-colors"
                        >
                          <Store size={15} className="text-teal" />
                          <span className="font-semibold">{t("nav.sellerPanel")}</span>
                        </Link>
                      )}
                      <div className="border-t border-teal-border my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        <span className="font-semibold">{t("nav.signOut")}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Guest buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-5 py-2 text-sm font-semibold text-dark bg-teal-wash rounded-full hover:bg-teal-border transition-colors"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-purple rounded-full hover:bg-purple-dark transition-colors"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LangSwitcher compact />
            <Link
              href="/cart"
              className="relative p-2 text-dark rounded-full hover:bg-teal-wash transition-colors"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-dark rounded-full hover:bg-teal-wash transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white border border-teal-border rounded-2xl shadow-sm">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-muted hover:text-teal hover:bg-teal-wash rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-teal-border mt-2 space-y-2">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-black">
                          {currentUser.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="font-black text-dark text-sm">
                          {currentUser.name}
                        </div>
                        <div className="text-xs text-muted capitalize">
                          {currentUser.role}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-teal border border-teal-border rounded-xl hover:bg-teal-wash transition-colors"
                    >
                      <LayoutDashboard size={15} /> {t("nav.dashboard")}
                    </Link>
                    {isSeller && (
                      <Link
                        href="/dashboard/supplier"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-teal border border-teal-border rounded-xl hover:bg-teal-wash transition-colors"
                      >
                        <Store size={15} /> {t("nav.sellerPanel")}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-dark bg-teal-wash rounded-xl"
                    >
                      {t("nav.signIn")}
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-purple rounded-xl"
                    >
                      {t("nav.register")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
