import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      },
      {
        protocol: 'https',
        hostname: '*.convex.cloud'
      },
      {
        protocol: 'https',
        hostname: '*.cabrerajorge.com'
      }
    ]
  }
};

export default nextConfig;
