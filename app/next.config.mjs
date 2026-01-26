/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js gère déjà les MIME types correctement
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;