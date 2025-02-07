import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const parsedUrl = supabaseUrl ? new URL(supabaseUrl) : undefined;

const nextConfig: NextConfig = {
  images: {
    domains: parsedUrl ? [parsedUrl.hostname] : [],
  },
};

export default nextConfig;
