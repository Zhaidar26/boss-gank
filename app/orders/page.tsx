"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderPage() {
    const { orders } = useOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <p className="text-center p-20 text-gray-400">Memuat data pesanan...</p>;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success":
                return <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold">Lunas / Sukses</span>;
            case "pending":
                return <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold animate-pulse">Menunggu Pembayaran</span>;
            case "processing":
                return <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">Sedang Dimasak 🍕</span>;
            default:
                return <span className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full font-bold">Gagal</span>;
        }
    };

    const activeOrders = orders || [];

    if (activeOrders.length === 0) {
        return (
            <main className="min-h-screen bg-white p-10 flex flex-col items-center justify-center text-black">
                <h1 className="text-xl font-bold mb-2 tracking-wide">Belum Ada Riwayat Pesanan</h1>
                <p className="text-gray-400 text-sm mb-6">Semua transaksi yang Anda lakukan akan muncul di sini.</p>
                <Link href="/" className="bg-black text-white rounded-3xl px-6 py-2.5 text-xs font-bold tracking-widest uppercase">Mulai Belanja</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 text-black p-6 md:p-20">
            <h1 className="text-2xl md:text-3xl font-black tracking-widest mb-10">RIWAYAT PESANAN</h1>

            <div className="space-y-6 max-w-4xl">
                {activeOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">

                        {/* Atas: ID Transaksi & Status */}
                        <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 gap-2">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ID PESANAN</p>
                                <p className="text-sm font-black text-black">{order.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">STATUS</p>
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        {/* Tengah: Item Daftar Belanja */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item Yang Dibeli</p>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm text-gray-700">
                                    <span>{item.name} <b className="text-gray-400 text-xs">x{item.quantity}</b></span>
                                    <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bawah: Total Biaya & Metode Pembayaran */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 bg-neutral-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Metode: <span className="uppercase font-bold text-gray-600">{order.paymentMethod}</span></p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-medium">Total Pembayaran</p>
                                <p className="text-lg font-black text-black">Rp {order.total.toLocaleString()}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </main>
    );
}