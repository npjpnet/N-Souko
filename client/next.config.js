/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const path = require('path');

module.exports = withPWA({
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  pwa: {
    dest: 'public',
  },
});
