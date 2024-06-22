/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async() => [
    {
    source: "/home",
    destination: "/",
    permanent: true,
    }
  ]
}

module.exports = nextConfig