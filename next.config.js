/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push('_http_common');
      }
      return config;
    },
  };
  
  module.exports = nextConfig;