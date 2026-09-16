import type { NextConfig } from "next";
import path from "node:path";

const getApiRemotePatterns = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const url = new URL(apiUrl);
    const protocol = (url.protocol.replace(":", "") || "http") as "http" | "https";
    return [
      {
        protocol,
        hostname: url.hostname,
        port: url.port || undefined,
      },
    ];
  } catch {
    return [];
  }
};

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      ...getApiRemotePatterns(),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
      },
      {
        protocol: "http",
        hostname: "192.168.100.122",
        port: "4000",
      },
      {
        protocol: "https",
        hostname: "192.168.100.122",
        port: "4000",
      },
      {
        protocol: "http",
        hostname: "103.130.213.159",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "103.130.213.159",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "giaoxusanam.vn",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.giaoxusanam.vn",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "giaoxusanam.vn",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "*.giaoxusanam.vn",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
