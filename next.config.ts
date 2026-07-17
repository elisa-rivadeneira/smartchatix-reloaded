import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pdfkit': 'commonjs pdfkit'
      });
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdfkit']
  }
};

export default nextConfig;
