"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useOrderStore, Order } from "@/store/useOrderStore";

export default function CartPage() {
    const { data: session } = useSession();
    const globalCart = useCart((state) => state.cart);
    const minusQuantity = useCart((state) => state.minusQuantity);
    const addToCart = useCart((state) => state.addToCart);
    const clearCart = useCart((state) => state.clearCart);

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const addOrder = useOrderStore((state) => state.addOrder);

    const currentUserId = (session?.user as any)?.id || "guest";

    const myCartItems = globalCart.filter((item) => item.userId === currentUserId);

    const [shippingData, setShippingData] = useState({
        name: "",
        phone: "",
        address: "",
        notes: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("midtrans");

    useEffect(() => {
        setMounted(true);
        const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        const myMidtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

        const script = document.createElement("script");
        script.src = snapSrcUrl;
        script.setAttribute("data-client-key", myMidtransClientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    if (!mounted) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center text-black">
                <p className="text-sm text-gray-400 animate-pulse">Memuat halaman checkout...</p>
            </main>
        );
    }

    const totalPrice = myCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleDecreaseQuantity = (item: any) => {
        minusQuantity(currentUserId, item.id);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShippingData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shippingData.name || !shippingData.phone || !shippingData.address) {
            alert("Mohon lengkapi Nama, Nomor HP, dan Alamat Pengiriman!");
            return;
        }

        const randomOrderId = `BOSS-${Date.now()}`;

        const newOrderData: Order = {
            id: randomOrderId,
            customer: {
                name: shippingData.name,
                address: shippingData.address,
                notes: shippingData.notes,
                phone: Number(shippingData.phone) || 0,
            },
            items: myCartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
            total: totalPrice,
            paymentMethod: paymentMethod as "midtrans" | "whatsapp",
            status: paymentMethod === "whatsapp" ? "success" : "pending",
            date: new Date().toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };

        // ─── OPSI 1: PROSES VIA WHATSAPP ───
        if (paymentMethod === "whatsapp") {
            addOrder(newOrderData);

            const nomorWA = "6281331996233";

            let teksDaftarBelanja = "";
            myCartItems.forEach((item, index) => {
                teksDaftarBelanja += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString()}\n`;
            });

            const pesanWhatsApp = `Halo Boss Gank Pizza, saya ingin memesan produk berikut:\n\n${teksDaftarBelanja}\n*Total Pembayaran:* Rp ${totalPrice.toLocaleString()}\n\n*Data Pengiriman:*\nNama: ${shippingData.name}\nNo. HP: ${shippingData.phone}\nAlamat: ${shippingData.address}\nCatatan: ${shippingData.notes || "-"}`;

            const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesanWhatsApp)}`;

            clearCart(currentUserId);
            window.open(linkWA, "_blank");
            window.location.href = "/orders";
            return;
        }

        // ─── OPSI 2: PROSES VIA MIDTRANS ───
        if (paymentMethod === "midtrans") {
            setLoading(true);

            try {
                const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: randomOrderId,
                        total: totalPrice,
                        customer: shippingData,
                        items: myCartItems,
                    }),
                });

                const data = await res.json();

                if (data.token) {
                    setLoading(false);
                    addOrder(newOrderData);
                    
                    // Panggil popup snap Midtrans
                    (window as any).snap.pay(data.token, {
                        onSuccess: function (result: any) {
                            useOrderStore.getState().updateOrderStatus(randomOrderId, "success");
                            alert("Pembayaran Berhasil! Terima kasih.");
                            clearCart(currentUserId); // ✅ FIX: Kirim currentUserId
                            window.location.href = "/orders";
                        },
                        onPending: function (result: any) {
                            alert("Menunggu pembayaran Anda.");
                            clearCart(currentUserId); // ✅ FIX: Kirim currentUserId
                            window.location.href = "/";
                        },
                        onError: function (result: any) {
                            useOrderStore.getState().updateOrderStatus(randomOrderId, "failed");
                            alert("Pembayaran gagal, silakan coba lagi.");
                            setLoading(false);
                        },
                        onClose: function () {
                            alert("Anda menutup halaman pembayaran sebelum selesai.");
                            setLoading(false);
                        },
                    });
                } else {
                    throw new Error(data.error || "Gagal mendapatkan token pembayaran");
                }
            } catch (err: any) {
                alert(`Error Midtrans: ${err.message}`);
                setLoading(false);
            }
        }
    };

    // ✅ FIX: Cek kekosongan menggunakan myCartItems
    if (myCartItems.length === 0) {
        return (
            <main className="min-h-screen bg-white p-10 flex flex-col items-center justify-center text-black">
                <h1 className="text-2xl font-semibold mb-2 tracking-wide">Keranjang Anda Kosong</h1>
                <Link href="/" className="bg-black text-white rounded-3xl px-6 py-3 text-sm font-medium">Kembali ke Katalog</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white p-6 md:p-20 text-black">
            <h1 className="text-2xl md:text-3xl font-bold mb-10 tracking-widest text-center md:text-left">CHECKOUT SYSTEM</h1>

            <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">

                    {/* 1. Review Barang */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-sm font-bold mb-6 tracking-wider text-gray-400 uppercase">1. Review Barang</h2>
                        <div className="space-y-6">
                            {/* ✅ FIX: Looping menggunakan myCartItems */}
                            {myCartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1">Rp {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 md:gap-8">
                                        <div className="flex items-center border border-gray-200 rounded-xl px-2 py-0.5 gap-2.5">
                                            <button type="button" onClick={() => handleDecreaseQuantity(item)} className="text-gray-400 font-bold text-sm cursor-pointer">-</button>
                                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                            {/* ✅ FIX: Panggil addToCart dengan format (userId, produk) */}
                                            <button type="button" onClick={() => addToCart(currentUserId, item)} className="text-gray-400 font-bold text-sm cursor-pointer">+</button>
                                        </div>
                                        <span className="font-semibold text-sm min-w-[70px] text-right">Rp {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Data Pengiriman */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold mb-4 tracking-wider text-gray-400 uppercase">2. Data Pengiriman</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 block mb-2">Nama Lengkap</label>
                                <input type="text" name="name" value={shippingData.name} onChange={handleInputChange} placeholder="Nama penerima" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 block mb-2">Nomor HP / WhatsApp</label>
                                <input type="tel" name="phone" value={shippingData.phone} onChange={handleInputChange} placeholder="081234xxx" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" required />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 block mb-2">Alamat Lengkap</label>
                            <textarea name="address" value={shippingData.address} onChange={handleInputChange} placeholder="Alamat rumah lengkap" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none" required />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 block mb-2">Catatan (Opsional)</label>
                            <input type="text" name="notes" value={shippingData.notes} onChange={handleInputChange} placeholder="Contoh: Titip di pos satpam" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                        </div>
                    </div>

                    {/* 3. Metode Pembayaran */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-sm font-bold mb-4 tracking-wider text-gray-400 uppercase">3. Metode Pembayaran</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "midtrans" ? "border-black bg-gray-50" : "border-gray-200"}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="midtrans" checked={paymentMethod === "midtrans"} onChange={() => setPaymentMethod("midtrans")} className="accent-black" />
                                    <div>
                                        <p className="text-sm font-bold">Transfer E-Wallet</p>
                                        <p className="text-xs text-gray-400">Virtual Account, QRIS, Gopay</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "whatsapp" ? "border-black bg-gray-50" : "border-gray-200"}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="whatsapp" checked={paymentMethod === "whatsapp"} onChange={() => setPaymentMethod("whatsapp")} className="accent-black" />
                                    <div>
                                        <p className="text-sm font-bold">Pesan Instan via WhatsApp</p>
                                        <p className="text-xs text-gray-400">Konfirmasi manual lewat chat</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Ringkasan Pembayaran Akhir */}
                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl h-fit border border-gray-100 sticky top-24">
                    <h2 className="text-sm font-bold mb-6 tracking-widest text-gray-400 uppercase">Ringkasan Order</h2>
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-sm font-bold text-gray-700">Total Pembayaran</span>
                        <span className="text-xl font-black">Rp {totalPrice.toLocaleString()}</span>
                    </div>

                    <button type="submit" disabled={loading} className="bg-black text-white text-xs tracking-widest rounded-3xl py-4 w-full hover:bg-gray-800 transition font-bold text-center block uppercase disabled:bg-gray-400 cursor-pointer">
                        {loading ? "Memproses Transaksi..." : "Selesaikan Pemesanan"}
                    </button>
                </div>
            </form>
        </main>
    );
}