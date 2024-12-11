/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.ltmedia.pl',
                pathname: '/assets/img/**'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },

};

export default nextConfig;
