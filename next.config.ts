import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",//this shit is required for docker containerization
};

export default nextConfig;
