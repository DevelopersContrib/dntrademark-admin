/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**',
            },
        ],
        domains : ['lh3.googleusercontent.com', 'localhost'] // <== Domain name
    },
}

module.exports = nextConfig
