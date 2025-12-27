import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["aspuovvhrtzozbrrydjm.supabase.co"],
    localPatterns: [
      {
        pathname: "/api/recipe-image",
        search: "path=**",
      },
    ],
  },
}

export default nextConfig
