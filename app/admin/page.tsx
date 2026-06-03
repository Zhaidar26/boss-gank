"use client";

import { useState, useEffect } from "react";
import { useProductStore, Product } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic"; // 🚀 1. Import modul dynamic bawaan Next.js

// 🚀 2. Bungkus seluruh logika dashboard utama kamu ke dalam fungsi komponen terpisah
function AdminDashboardContent() {
    const { products, addProduct, deleteProduct, updateProduct, fetchProducts } = useProductStore();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [imageSource, setImageSource] = useState<"upload" | "link">("upload");
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
        isPizza: false,
        isDessert: false,
        isDrink: false,
        isRecommended: false,
        isResto: false,
    });

    useEffect(() => {
        if (status === "unauthenticated" || (status === "authenticated" && (session?.user as any).role !== "ADMIN")) {
            router.push("/login");
        }
    }, [status, session, router]);

    useEffect(() => {
        setMounted(true);
        if (status === "authenticated" && (session?.user as any).role === "ADMIN") {
            fetchProducts();
        }
    }, [status, session, fetchProducts]);

    if (status === "loading" || !mounted) {
        return (
            <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                <p className="text-center mt-4 text-sm text-gray-500 font-semibold animate-pulse">Memverifikasi Otoritas Admin...</p>
            </div>
        );
    }

    if (!session || (session.user as any).role !== "ADMIN") return null;

    const handleEditClick = (product: Product) => {
        setEditingId(product.id);
        setForm({
            name: product.name,
            price: String(product.price),
            image: product.image,
            description: product.description,
            isPizza: product.category.includes("pizza"),
            isDessert: product.category.includes("dessert"),
            isDrink: product.category.includes("drink"),
            isResto: product.category.includes("resto"),
            isRecommended: product.isRecommended,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: "", price: "", image: "", description: "", isPizza: false, isDessert: false, isDrink: false, isResto: false, isRecommended: false });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            setForm((prev) => ({ ...prev, [name]: target.checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.price || !form.image) {
            alert("Nama, Harga, dan Gambar wajib diisi!");
            return;
        }

        const selectedCategories: ("pizza" | "dessert" | "drink" | "resto")[] = [];
        if (form.isPizza) selectedCategories.push("pizza");
        if (form.isDessert) selectedCategories.push("dessert");
        if (form.isDrink) selectedCategories.push("drink");
        if (form.isResto) selectedCategories.push("resto");

        if (selectedCategories.length === 0) {
            alert("Mohon pilih minimal satu kategori untuk produk ini!");
            return;
        }

        const productData = {
            name: form.name,
            price: Number(form.price) || 0,
            image: form.image,
            description: form.description || "",
            category: selectedCategories,
            isRecommended: form.isRecommended,
        };

        try {
            if (editingId !== null) {
                await updateProduct(editingId, productData);
                alert(`Menu "${form.name}" berhasil diperbarui di cloud!`);
                setEditingId(null);
            } else {
                await addProduct(productData);
                alert(`Menu "${form.name}" berhasil ditambahkan ke katalog cloud!`);
            }

            setForm({
                name: "", price: "", image: "", description: "",
                isPizza: false, isDessert: false, isDrink: false, isResto: false, isRecommended: false
            });
            fetchProducts();
        } catch (error) {
            console.error("gagal menyimpan produk:", error);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-100 text-black p-6 md:p-20">
            {/* ... ISI RETURN HTML DASHBOARD KAMU YANG LENGKAP SEPERTI KEMARIN ... */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl md:text-3xl font-black tracking-wider">🛠️ ADMIN PRODUCT DASHBOARD</h1>
                <p className="text-gray-500 text-sm">Selamat datang kembali, {session.user?.name} 🔥</p>
                <Link href="/" className="bg-black text-white text-xs px-4 py-2 rounded-3xl hover:bg-gray-800 transition">Lihat Toko</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Tambah/Edit */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 h-fit">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className={`text-sm font-bold uppercase tracking-wider ${editingId ? "text-amber-600 animate-pulse" : "text-gray-400"}`}>
                            {editingId ? "📝 Mode Edit Menu" : "Tambah Menu Baru"}
                        </h2>
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-600">Nama Menu</label>
                        <input type="text" name="name" value={form.name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" required />
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-600">Harga (Rp)</label>
                        <input type="number" name="price" value={form.price} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" required />
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-600">Gambar Produk</label>
                        <div className="flex gap-2 mb-2 p-1 bg-gray-100 rounded-xl w-fit">
                            <button type="button" onClick={() => setImageSource("upload")} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition ${imageSource === "upload" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"}`}>📁 Upload File</button>
                            <button type="button" onClick={() => setImageSource("link")} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition ${imageSource === "link" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"}`}>🔗 Paste Link URL</button>
                        </div>

                        {imageSource === "upload" ? (
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsUploading(true);
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        try {
                                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                                            const data = await res.json();
                                            if (!res.ok) throw new Error(data.error);
                                            setForm((prev) => ({ ...prev, image: data.url }));
                                        } catch (err) {
                                            alert("Gagal mengunggah gambar ke cloud.");
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }}
                                    className="w-full bg-gray-50 border border-gray-200 border-dashed rounded-xl px-4 py-3 text-sm focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-black file:text-white"
                                />
                                {isUploading && <p className="text-[11px] text-amber-600 font-bold animate-pulse">⏳ Sedang mengunggah...</p>}
                            </div>
                        ) : (
                            <input type="text" name="image" value={form.image} onChange={handleInputChange} placeholder="https://link-gambar.jpg" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" />
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-600">Deskripsi Singkat</label>
                        <textarea name="description" value={form.description} onChange={handleInputChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none" required />
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-2 text-gray-600">Kategori</label>
                        <div className="space-y-1.5 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isPizza" checked={form.isPizza} onChange={handleInputChange} className="accent-black" /> Pizza</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isDessert" checked={form.isDessert} onChange={handleInputChange} className="accent-black" /> Dessert</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isDrink" checked={form.isDrink} onChange={handleInputChange} className="accent-black" /> Minuman</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isResto" checked={form.isResto} onChange={handleInputChange} className="accent-black" /> Resto</label>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-amber-600">
                            <input type="checkbox" name="isRecommended" checked={form.isRecommended} onChange={handleInputChange} className="accent-amber-500 h-4 w-4" />
                            Set as 'Paling Disukai Hari Ini' 🔥
                        </label>
                    </div>

                    <div className="space-y-2 pt-2">
                        <button type="submit" className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:bg-gray-800 transition">
                            {editingId ? "🎯 Simpan Perubahan" : "Masukkan ke Katalog"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} className="w-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-bold tracking-widest uppercase py-3 rounded-xl">✕ Batal Edit</button>
                        )}
                    </div>
                </form>

                {/* Kolom Daftar Menu Aktif */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Daftar Menu Aktif ({products.length})</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-black">{product.name}</h3>
                                        <p className="text-xs text-amber-600 font-medium">Rp {product.price.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditClick(product)} className="text-xs text-black bg-neutral-50 hover:bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 font-bold">Edit</button>
                                    <button onClick={async () => { 
                                        if (confirm(`Yakin ingin menghapus ${product.name}?`)) {
                                            await deleteProduct(product.id);
                                            fetchProducts();
                                        }
                                    }} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl font-medium">Hapus</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

// 🚀 3. EXPORT UTAMA: Matikan SSR total khusus untuk halaman ini agar lolos build!
export default dynamic(() => Promise.resolve(AdminDashboardContent), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="text-center mt-4 text-sm text-gray-500 font-semibold animate-pulse">Menyiapkan Environtment Admin...</p>
        </div>
    )
});