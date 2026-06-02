import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

// 🚀 Memaksa Prisma CLI agar membaca variabel lingkungan dari .env.local milik Next.js
dotenv.config({ path: ".env.local" });

export default defineConfig({
  earlyAccess: true, // Kadang diperlukan di beberapa sub-versi Prisma 7
  datasource: {
    url: process.env.DATABASE_URL,
    // 🎯 Di sini directUrl akan dianggap LEGAL dan VALID oleh TypeScript
    directUrl: process.env.DIRECT_URL, 
  },
} as any);