// /*/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.clerk.dev',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'www.gravatar.com',
//         pathname: '/avatar/**',
//       },
//     ],
//   },
// };
// next.config.js
// next.config.js
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
    trailingSlash: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.clerk.dev', pathname: '/**' },
      { protocol: 'https', hostname: 'www.gravatar.com', pathname: '/avatar/**' },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
})(nextConfig);

