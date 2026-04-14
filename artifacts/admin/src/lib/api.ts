const BASE = "/api";

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export interface AdminProduct {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  categoryNameAr: string;
  featured: boolean;
  inStock: boolean;
  quantity: number;
  rating: string;
  reviewCount: number;
  createdAt: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  productCount: number;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  inStock: number;
  outOfStock: number;
  featured: number;
}

export const api = {
  getStats: () => req<AdminStats>("GET", "/admin/stats"),
  getProducts: () => req<AdminProduct[]>("GET", "/admin/products"),
  createProduct: (data: Omit<AdminProduct, "id" | "categoryName" | "categoryNameAr" | "rating" | "reviewCount" | "createdAt">) =>
    req<AdminProduct>("POST", "/admin/products", data),
  updateProduct: (id: number, data: Partial<AdminProduct>) =>
    req<AdminProduct>("PUT", `/admin/products/${id}`, data),
  deleteProduct: (id: number) =>
    req<{ success: boolean }>("DELETE", `/admin/products/${id}`),
  getCategories: () => req<AdminCategory[]>("GET", "/admin/categories"),
  createCategory: (data: Omit<AdminCategory, "id" | "productCount">) =>
    req<AdminCategory>("POST", "/admin/categories", data),
  updateCategory: (id: number, data: Partial<Omit<AdminCategory, "id" | "productCount">>) =>
    req<AdminCategory>("PUT", `/admin/categories/${id}`, data),
  deleteCategory: (id: number) =>
    req<{ success: boolean }>("DELETE", `/admin/categories/${id}`),
  uploadImage: async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${BASE}/admin/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.imageUrl;
  },
};
