"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal mendaftar.");
            }

            alert("Akun berhasil dibuat! Silakan masuk.");
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6 text-black">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-black tracking-wider uppercase">🍕 Daftar Akun</h1>
                    <p className="text-gray-400 text-xs mt-1">Gabung Boss Gank Pizza untuk mulai order menu terbaik</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl font-medium text-center animate-shake">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-600">Nama Lengkap</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Contoh: Zhafif Haidar" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" required />
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-600">Alamat Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="nama@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" required />
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-600">Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" required />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:bg-gray-800 transition disabled:bg-gray-400 cursor-pointer">
                        {loading ? "Memproses..." : "Daftar Sekarang"}
                    </button>
                </form>

                <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Sudah punya akun? <Link href="/login" className="font-bold text-black underline">Masuk di sini</Link>
                </div>
            </div>
        </main>
    );
}