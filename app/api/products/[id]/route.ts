import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// ─── 1. API UNTUK MENGHAPUS PRODUK (NEXT.JS 15 COMPLIANT) ───
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 🚀 Ubah menjadi Promise sesuai regulasi Next.js 15
) {
  try {
    // 🚀 Wajib di-await terlebih dahulu sebelum mengambil id
    const resolvedParams = await params; 
    const productId = parseInt(resolvedParams.id);

    await prisma.product.delete({
      where: { id: productId },
    });
    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── 2. API UNTUK UPDATE / EDIT PRODUK (NEXT.JS 15 COMPLIANT) ───
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 🚀 Ubah menjadi Promise sesuai regulasi Next.js 15
) {
  try {
    // 🚀 Wajib di-await terlebih dahulu sebelum mengambil id
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    
    const body = await request.json();
    const { name, price, image, description, category, isRecommended } = body;

    // Proteksi pengondisian array kategori
    const formattedCategory = Array.isArray(category) 
      ? category 
      : category ? [category] : ["pizza"];

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: String(name),
        price: Math.floor(Number(price)) || 0,
        image: String(image),
        description: description ? String(description) : "",
        category: formattedCategory,
        isRecommended: Boolean(isRecommended),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}