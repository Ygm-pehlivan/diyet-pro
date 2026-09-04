import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Projeyi statik dosyalara derler
  images: {
    unoptimized: true, // GitHub Pages statik resim optimizasyonunu desteklemediği için kapatıyoruz
  },
};

export default nextConfig;