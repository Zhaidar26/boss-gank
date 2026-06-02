import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: {createdAt: "desc"},
        });
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({error: error.massage}, {status: 500});
    }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, image, description, category, isRecommended } = body;
    const formattedCategory = Array.isArray(category) 
      ? category 
      : category ? [category] : [];

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        image,
        description,
        category: formattedCategory, // Array string otomatis disimpan rapi oleh PostgreSQL
        isRecommended: Boolean(isRecommended),
      },
    });

    return NextResponse.json(newProduct);
  } catch (error: any) {
    console.error("ERROR NYATA PRISMA:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}