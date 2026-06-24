/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.vnoc.com',
            },
        ],
    },
    // Use an in-memory webpack cache in dev. The default on-disk PackFileCache
    // gets corrupted ("invalid literal/length code") if the dev server is killed
    // mid-write, which produces broken client chunks and the runtime error
    // "Cannot read properties of undefined (reading 'call')".
    webpack: (config, { dev }) => {
        if (dev) {
            config.cache = { type: 'memory' };
        }
        return config;
    },
}

module.exports = nextConfig
