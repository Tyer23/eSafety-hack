/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Improve dev server stability
  onDemandEntries: {
    // Keep pages in memory longer (default: 15000ms)
    maxInactiveAge: 60 * 1000,
    // Increase pages kept in memory (default: 5)
    pagesBufferLength: 5,
  },
};

export default nextConfig;


