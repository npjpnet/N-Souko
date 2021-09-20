/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const path = require('path');

module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  target: 'serverless',
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
});
