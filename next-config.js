/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/story.html',
        destination: '/api/serve-story'
      }
    ]
  }
}

module.exports = nextConfig