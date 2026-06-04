import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { useSession } from "next-auth/react";
import AddToCartButton from "@/components/AddToCartButton";
import { notFound } from "next/navigation";

// 🚀 2. Paksa halaman agar selalu mengambil data real-time, anti-cache!
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { id } = await params;

    // 🚀 3. Ambil data produk langsung dari database Supabase berdasarkan ID (String / Int)
    // Jika di database kamu ID berbentuk angka (Int), gunakan parseInt(id). Jika String/UUID, gunakan id saja.
    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id) // Kunci sinkronisasi database, Boss!
        },
    });

    // Jika produk tidak ditemukan di database, lemparkan ke halaman 404
    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white p-10 md:p-20 text-black">
            <Link href="/" className="text-sm text-white hover:scale-108 transition-transform mb-8 inline-block bg-black py-2 px-4 rounded-3xl">
                Kembali
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
                <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden bg-gray-100">
                    <Image src={product.image} alt={product.name} fill priority className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                    <p className="text-2xl text-gray-800 font-semibold mb-6">Rp {product.price.toLocaleString()}</p>
                    <hr className="border-gray-200 mb-6" />
                    <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                    {/* Kirim data produk dari database ke tombol keranjang */}
                    {/* @ts-ignore */}
                    <AddToCartButton product={product} />
                </div>
            </div>
        </main>
    );
}