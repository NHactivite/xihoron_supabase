
import withPWA from 'next-pwa';

let mydisable;
let myremoveConsole;
process.env.RUN_MODE=="devlopment"?mydisable=true:mydisable=false
process.env.RUN_MODE=="devlopment"?myremoveConsole=false:myremoveConsole=true

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  compiler: {
    removeConsole:myremoveConsole,
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
  disable:mydisable,
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: 'sw.js',
})(nextConfig);
