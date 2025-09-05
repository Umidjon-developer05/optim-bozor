const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
});

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", pathname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,

  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
