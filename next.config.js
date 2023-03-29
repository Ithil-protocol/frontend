/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/lend',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
