import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus dari database" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const body = await request.json();
    const {name, price, image, description, category, isRecommended} = body;

    const formattedCategory = Array.isArray(category)
    ? category
    : category ? [category] : ["pizza"];

    const updateProduct = await prisma.product.update({
        where: {id: productId},
        data: {
            name: String(name),
            price: Math.floor(Number(price)) || 0,
            image: String(image),
            description: description ? String(description) : "",
            category: formattedCategory,
            isRecommended: Boolean(isRecommended)
        },
    });

    return NextResponse.json(updateProduct);
  } catch (error: any) {
    return NextResponse.json({error: error.massage}, {status: 500});
  }
}