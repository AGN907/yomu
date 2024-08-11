/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@yomu/ui', '@yomu/core', '@yomu/sources'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['@node-rs/argon2'],
  },
}

export default nextConfig
