import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dynamic-greyhound-605.eu-west-1.convex.cloud'
      }
    ]
  }
};

export default nextConfig;
