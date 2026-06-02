/** @type {import('next').NextConfig} */
const nextConfig = {
  /* konfigurasi tambahan jika ada di file lama Anda */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.gojekapi.com", // 🚀 Izinkan gambar dari Gojek
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Jaga-jaga kalau Boss masih pakai gambar Unsplash
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;