"use client";

import { useCart } from "@/store/useCart";
import { useSession } from "next-auth/react";

interface AddToCartButtonProps {
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
    };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { data: session } = useSession();
    const addToCart = useCart((state) => state.addToCart);

    const handleKlik = () => {
        const currentUserId = (session?.user as any)?.id || "guest";

        console.log("tombol diklik untuk produk:", product);
        addToCart(currentUserId, {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        alert(`${product.name} dimasukkan ke keranjang!`)
    };

    return (
        <button onClick = {handleKlik} className="bg-black z-10 text-white rounded-3xl py-4 px-8 hover:bg-gray-800 transition font-medium w-full md:w-auto">
            Tambah ke Keranjang
        </button>
    );
}