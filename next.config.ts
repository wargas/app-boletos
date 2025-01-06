import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BUILD_TIMESTAMP: (new Date()).toISOString()
  }
  /* config options here */
};

export default nextConfig;
