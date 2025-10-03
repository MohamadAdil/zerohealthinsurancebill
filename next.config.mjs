/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['backend.zerohealthinsurancebill.com', 'api.zerohealthinsurancebill.com'],
  },
  compress: true,
  transpilePackages: ['d3', 'd3-org-chart'],
};
export default nextConfig;
