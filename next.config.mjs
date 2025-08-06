
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
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
};

export default withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: 'sw.js',
})(nextConfig);
