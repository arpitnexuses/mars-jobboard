/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '22527425.fs1.hubspotusercontent-na1.net',
        port: '',
        pathname: '/hubfs/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/getreturnship.com/**',
      }
    ],
  },
};

module.exports = nextConfig; 