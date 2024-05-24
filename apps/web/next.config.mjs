/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@yomu/ui'],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname:"*"
            }

        ]
    },
    experimental: {
        serverComponentsExternalPackages: ["@node-rs/argon2"],
    }
}

export default nextConfig
