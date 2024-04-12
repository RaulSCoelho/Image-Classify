/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-classify.s3.amazonaws.com'
      }
    ]
  }
}

export default nextConfig
