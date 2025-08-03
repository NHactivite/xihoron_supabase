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
  trailingSlash: true, // ✅ Ensures paths like /app/ match PWA scope rules
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
  // If you are using a basePath like `/app`, include it here too:
  // basePath: '/app',
};

export default withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
  scope: '/',         // ✅ Make sure the PWA scope is correct (e.g., '/' or '/app/')
  sw: 'service-worker.js', // optional if your service worker file is custom named
})(nextConfig);
