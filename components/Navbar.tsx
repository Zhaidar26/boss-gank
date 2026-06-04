"use client";

import Link from "next/link";
import { useCart } from "@/store/useCart";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const cart = useCart((state) => state.cart);
  const [totalItems, setTotalItems] = useState(0);

  const { data: session, status } = useSession();

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

        {status === "authenticated" && (session?.user as any).role === "ADMIN" && (
          <Link href="/admin" className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 uppercase tracking-wider hover:bg-amber-100 transition">
            Masuk Ke Dashboard
          </Link>
        )}
        {status === "loading" ? (
          // Efek loading tipis saat NextAuth sedang memverifikasi cookie session
          <div className="h-6 w-16 bg-gray-100 animate-pulse rounded-full"></div>
        ) : status === "authenticated" ? (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 pl-3 pr-2 py-1 rounded-full text-xs">
            <div className="flex flex-col text-right">
              <span className="font-bold max-w-[90px] truncate">{session.user?.name}</span>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                {(session.user as any).role}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm("Yakin ingin keluar dari akun?")) {
                  signOut({ callbackUrl: "/" });
                }
              }} className="bg-black text-white px-2.5 py-1 rounded-full text-[10px] font-bold hover:bg-red-600 transition cursor-pointer">
              Keluar
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-sm font-bold bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition">
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}