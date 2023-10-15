/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**',
            },
        ],
        domains: ['lh3.googleusercontent.com', 'localhost', 'cdn.vnoc.com'] // <== Domain name
    },
}

module.exports = nextConfig
