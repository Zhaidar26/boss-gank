import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Pastikan env terbaca dengan aman
dotenv.config({ path: ".env.local" });

// 1. Buat koneksi pool mentah menggunakan pg driver ke DIRECT_URL (yang paling stabil)
const pool = new Pool({ connectionString: process.env.DIRECT_URL });

// 2. Bungkus ke dalam Adapter PostgreSQL resmi milik Prisma 7
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 3. Masukkan adapter ke dalam constructor PrismaClient sesuai regulasi Prisma 7
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter, // 🚀 Kunci perbaikan ada di sini, Boss!
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;