import { create } from "zustand";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string[];
  isRecommended: boolean;
}

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateProduct: (id: number, updateData: Omit<Product, "id">) => Primise<void>;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  isLoading: false,

  // 🔄 Ambil data real-time dari Supabase via API
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set({ products: data, isLoading: false });
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      set({ isLoading: false });
    }
  },

  // ➕ Tambah produk langsung ke database Supabase
  addProduct: async (newProduct) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      // Refresh list produk setelah berhasil menambah
      await get().fetchProducts();
    } catch (error) {
      console.error("Gagal menambah produk:", error);
      alert("Gagal menyimpan produk ke database cloud.");
    }
  },

  // ❌ Hapus produk dari database Supabase
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      // Refresh list produk setelah berhasil menghapus
      await get().fetchProducts();
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
      alert("Gagal menghapus produk dari database cloud.");
    }
  },

  updateProduct: async (id, updateData) => {
    try{
        const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updateData),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error);
        }

        await get().fetchProducts();
    } catch (error) {
        console.error("Gagal Memperbarui Produk:", error);
        alert("Gagal memperbarui data produk ke Cloud");
    }
  },
}));