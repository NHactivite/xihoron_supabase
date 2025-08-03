
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // ✅ Ensures paths like /app/ match PWA scope rules
  swcMinify: true, 
  compiler: {
    removeConsole: true,
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
  skipWaiting: true,         // ✅ Make sure the PWA scope is correct (e.g., '/' or '/app/') // optional if your service worker file is custom named
})(nextConfig);
