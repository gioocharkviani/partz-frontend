'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ordersApi, isLoggedIn } from '@/lib/api';

interface CartContextType {
  items: any[];
  loading: boolean;
  addToCart: (partId: number, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQty: (itemId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) { setItems([]); return; }
    setLoading(true);
    try {
      const cart = await ordersApi.cart();
      setItems(cart);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Re-sync whenever auth state might have changed (login/logout navigations) */
  useEffect(() => { refresh(); }, [pathname, refresh]);

  const addToCart = useCallback(async (partId: number, quantity = 1) => {
    if (!isLoggedIn()) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '/')}`);
      return;
    }
    await ordersApi.addToCart(partId, quantity);
    await refresh();
  }, [router, pathname, refresh]);

  const removeFromCart = useCallback(async (itemId: number) => {
    await ordersApi.removeFromCart(itemId);
    await refresh();
  }, [refresh]);

  const updateQty = useCallback(async (itemId: number, qty: number) => {
    if (qty <= 0) { await removeFromCart(itemId); return; }
    await ordersApi.updateCartQty(itemId, qty);
    await refresh();
  }, [refresh, removeFromCart]);

  const clearCart = useCallback(async () => {
    await ordersApi.clearCart();
    setItems([]);
  }, []);

  const total = items.reduce((s, i) => s + Number(i.part?.price || 0) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQty, clearCart, refresh, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
