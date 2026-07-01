const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('partz_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) });
const patch = <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' });

/* ─── Auth ─── */
export const authApi = {
  register: (dto: { name: string; email: string; phone?: string; password: string; role: 'customer' | 'seller'; city?: string }) =>
    post<{ access_token: string; user: any }>('/auth/register', dto),
  login: (dto: { email: string; password: string }) =>
    post<{ access_token: string; user: any }>('/auth/login', dto),
};

/* ─── Users ─── */
export const usersApi = {
  me: () => get<any>('/users/me'),
  update: (dto: { name?: string; phone?: string; city?: string }) => patch<any>('/users/me', dto),
};

/* ─── Shops ─── */
export const shopsApi = {
  list: (query?: Record<string, string>) => get<any[]>(`/shops?${new URLSearchParams(query)}`),
  get: (id: number) => get<any>(`/shops/${id}`),
  brands: () => get<any[]>('/shops/brands'),
  categories: () => get<any[]>('/shops/categories'),
  modelsByBrand: (brandId: number) => get<any[]>(`/shops/brands/${brandId}/models`),
  myShop: () => get<any>('/shops/my/shop'),
  create: (dto: any) => post<any>('/shops/my/shop', dto),
  update: (dto: any) => patch<any>('/shops/my/shop', dto),
  addSpecialization: (dto: { brand_id: number; model_id?: number }) => post<any>('/shops/my/specializations', dto),
  removeSpecialization: (id: number) => del(`/shops/my/specializations/${id}`),
  getSpecializations: () => get<any[]>('/shops/my/specializations'),
  setCategories: (category_ids: number[]) => patch<any>('/shops/my/categories', { category_ids }),
};

/* ─── Parts ─── */
export const partsApi = {
  search: (query: Record<string, string | number>) => get<any[]>(`/parts?${new URLSearchParams(query as any)}`),
  get: (id: number) => get<any>(`/parts/${id}`),
  byShop: (shopId: number) => get<any[]>(`/parts/shop/${shopId}`),
  create: (dto: any) => post<any>('/parts', dto),
  update: (id: number, dto: any) => patch<any>(`/parts/${id}`, dto),
  delete: (id: number) => del(`/parts/${id}`),
};

/* ─── Cart & Orders ─── */
export const ordersApi = {
  cart: () => get<any[]>('/orders/cart'),
  addToCart: (part_id: number, quantity = 1) => post<any>('/orders/cart', { part_id, quantity }),
  updateCartQty: (itemId: number, quantity: number) => patch<any>(`/orders/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: number) => del(`/orders/cart/${itemId}`),
  clearCart: () => del('/orders/cart'),
  placeOrder: (dto: { delivery_address: string; delivery_city: string; phone: string; payment_method: string; notes?: string }) =>
    post<any>('/orders', dto),
  myOrders: () => get<any[]>('/orders'),
  sellerOrders: () => get<any[]>('/orders/seller'),
  getOrder: (id: number) => get<any>(`/orders/${id}`),
  acceptOrder: (id: number) => patch<any>(`/orders/${id}/accept`, {}),
  completeOrder: (id: number) => patch<any>(`/orders/${id}/complete`, {}),
  cancelOrder: (id: number) => patch<any>(`/orders/${id}/cancel`, {}),
};

/* ─── Requests ─── */
export const requestsApi = {
  create: (dto: { brand_id: number; model_id?: number; year?: string; description: string; category_id?: number }) =>
    post<any>('/requests', dto),
  myRequests: () => get<any[]>('/requests/my'),
  getOffers: (requestId: number) => get<any[]>(`/requests/${requestId}/offers`),
  acceptOffer: (requestId: number, offerId: number, orderDto?: { delivery_address?: string; delivery_city?: string; phone?: string; payment_method?: string; notes?: string }) =>
    patch<any>(`/requests/${requestId}/offers/${offerId}/accept`, orderDto || {}),
  rejectOffer: (requestId: number, offerId: number) => patch<any>(`/requests/${requestId}/offers/${offerId}/reject`, {}),
  incoming: () => get<any[]>('/requests/incoming'),
  makeOffer: (requestId: number, dto: { price: number; description: string; part_number?: string; condition?: string; delivery_days?: string }) =>
    post<any>(`/requests/${requestId}/offer`, dto),
};

/* ─── Auth helpers ─── */
export function saveAuth(token: string, user: any) {
  localStorage.setItem('partz_token', token);
  localStorage.setItem('partz_user', JSON.stringify(user));
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('partz_user');
  return u ? JSON.parse(u) : null;
}

export function logout() {
  localStorage.removeItem('partz_token');
  localStorage.removeItem('partz_user');
}

export function isLoggedIn() {
  return !!getToken();
}
