/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "viigyzjbfirktsgjijgc.supabase.co",
      },
    ],
  },
};

export default nextConfig;
