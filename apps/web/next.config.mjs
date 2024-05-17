/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@yomu/ui'],
    experimental: {
        serverComponentsExternalPackages: ["@node-rs/argon2"],
    }
}

export default nextConfig
