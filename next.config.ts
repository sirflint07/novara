import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1febewyvkc.ufs.sh",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
