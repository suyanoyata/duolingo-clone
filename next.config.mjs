/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "viigyzjbfirktsgjijgc.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  // compiler: {
  //   removeConsole: {
  //     exclude: ["error"],
  //   },
  // },
};

export default nextConfig;
