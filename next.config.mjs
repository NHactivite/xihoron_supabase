
import withPWA from "next-pwa";

// let mydisable;
// let myremoveConsole;
// process.env.RUN_MODE=="devlopment"?mydisable=true:mydisable=false
// process.env.RUN_MODE=="devlopment"?myremoveConsole=false:myremoveConsole=true

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  compiler: {
    removeConsole:true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: "lh3.googleusercontent.com", pathname: '/**' },
      { protocol: 'https', hostname: 'www.gravatar.com', pathname: '/avatar/**' },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable:false,
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: 'sw.js',
  
})(nextConfig);
