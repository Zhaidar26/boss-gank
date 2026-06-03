import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Data tidak lengkap!" }, { status: 400 });
        }

        // 1. Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email sudah digunakan oleh akun lain!" }, { status: 400 });
        }

        // 2. Hash password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Simpan ke database (Secara default role-nya USER)
        // Catatan: Jika ingin membuat akun ADMIN pertama kali, kamu bisa mengubah role-nya langsung di database (Prisma Studio / Supabase)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER" 
            }
        });

        return NextResponse.json({ message: "Registrasi berhasil!", user: { name: newUser.name, email: newUser.email } }, { status: 201 });

    } catch (error) {
        console.error("REGISTER_ERROR:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
    }
}