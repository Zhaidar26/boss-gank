import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

// 🚀 Memaksa Prisma CLI agar membaca variabel lingkungan dari .env.local milik Next.js
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // URL pooling (port 6543) untuk transaksi harian aplikasi
    url: process.env.DATABASE_URL,
    // URL direct (port 5432) khusus untuk eksekusi migrasi struktur tabel
    directUrl: process.env.DIRECT_URL,
  },
});