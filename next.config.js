// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Allow serving files from uploads directory
    async rewrites() {
      return [
        {
          source: '/uploads/:path*',
          destination: '/api/serve-file/:path*',
        },
      ];
    },
    
    // Optional: Configure headers for PDF files
    async headers() {
      return [
        {
          source: '/uploads/:path*.pdf',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/pdf',
            },
            {
              key: 'Content-Disposition',
              value: 'inline',
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;