import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // 🚀 Ambil variabel lingkungan yang sudah ada di .env.local kamu
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""; 

    // Bersihkan nama file dari spasi agar URL tidak rusak
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    
    // Konversi file mentah menjadi Array Buffer untuk dikirim via REST API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🎯 Tembak langsung REST API Storage Supabase tanpa bantuan package/library tambahan
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/boss-gank-images/${fileName}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "apikey": supabaseAnonKey,
          "Content-Type": file.type,
        },
        body: buffer,
      }
    );

    if (!uploadResponse.ok) {
      const errData = await uploadResponse.json();
      throw new Error(errData.message || "Gagal mengunggah ke Storage Supabase");
    }

    // 🔗 Susun URL Publik gambar (pastikan bucket 'pizza-images' di Supabase sudah kamu set ke Public)
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/boss-gank-images/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Gagal di server" }, { status: 500 });
  }
}