"use client";

import Image from "next/image";
import { useProductStore, Product } from "@/store/useProductStore";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── 1. KOMPONEN GRID PRODUK (DIPINDAH KE LUAR AGAR BEBAS EROR LINTER) ───
const ProductGrid = ({ items }: { items: Product[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {items.map((product) => ( 
      <Link
        href={`/product/${product.id}`}
        key={product.id}
        className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
      >
        <div className="relative h-56 w-full bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="font-bold text-lg text-black group-hover:text-amber-600 transition">{product.name}</h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
          </div>
          <p className="text-base font-black text-gray-900 mt-4">Rp {product.price.toLocaleString()}</p>
        </div>
      </Link>
    ))}
  </div>
);

// ─── 2. KOMPONEN HALAMAN UTAMA ───
export default function Home() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]); // Ditambahkan dependency agar linter tidak warning

  if (!mounted) return <p className="text-center p-20 text-gray-400">Loading Menu...</p>;

  // Filter kategori produk
  const recommendedProducts = products.filter((p) => p.isRecommended);
  const pizzaProducts = products.filter((p) => p.category.includes("pizza"));
  const restoProducts = products.filter((p) => p.category.includes("resto"));
  const dessertProducts = products.filter((p) => p.category.includes("dessert"));
  const drinkProducts = products.filter((p) => p.category.includes("drink"));

  return (
    <main className="min-h-screen bg-neutral-50 text-black px-6 py-12 md:px-20">
      {/* Header Website */}
      <div className="text-center md:text-left mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-black">
          BOSS GANK <span className="text-amber-500"> PIZZA </span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 tracking-wide uppercase">Pizza enak yo nak kene!</p>
      </div>
      <div className="mb-6">
      </div>

      {/* Body Website */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-slate-600 text-sm font-medium animate-pulse">Memuat Menu yang Lezat</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">Menunya Belum ditambah nih..</p>
          <p className="text-xs text-slate-400 mt-1">Hubungi Customer Service untuk melaporkan kesalahan</p>
        </div>
      ) : (
        <div className="space-y-20">
          {recommendedProducts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🔥</span>
                <h2 className="text-2xl font-black text-black tracking-wide border-amber-600 pb-1">
                  PALING DISUKAI HARI INI
                </h2>
              </div>
              <ProductGrid items={recommendedProducts} />
            </section>
          )}
          {restoProducts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🧑‍🍳</span>
                <h2 className="text-2xl font-black text-black tracking-wide">
                  PILIHAN RESTAURANT
                </h2>
              </div>
              <ProductGrid items={restoProducts} />
            </section>
          )}
          {pizzaProducts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🍕</span>
                <h2 className="text-2xl font-black text-black tracking-wide">
                  MENU PIZZA
                </h2>
              </div>
              <ProductGrid items={pizzaProducts} />
            </section>
          )}
          {dessertProducts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🍰</span>
                <h2 className="text-2xl font-black text-black tracking-wide">
                  MENU DESSERT
                </h2>
              </div>
              <ProductGrid items={dessertProducts} />
            </section>
          )}
          {drinkProducts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🍵</span>
                <h2 className="text-2xl font-black text-black tracking-wide">
                  MENU MINUMAN
                </h2>
              </div>
              <ProductGrid items={drinkProducts} />
            </section>
          )}
        </div>
      )}
    </main>
  );
}