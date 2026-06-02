"use client";

import Link from "next/link";
import { useCart } from "@/store/useCart";
import { useEffect, useState } from "react";

export default function Navbar() {
  const cart = useCart((state) => state.cart);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
  }, [cart]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center text-black">
      <Link href="/" className="text-xl font-bold tracking-widest">
        BOSS.GANK.PIZZA
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-black">Katalog</Link>
        <Link href="/cart" className="relative p-2">
          <span className="text-sm font-medium">Keranjang</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}