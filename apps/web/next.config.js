const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(
  {
    images: {
      deviceSizes: [320, 420, 768, 1024, 1200],
      domains: ['plant.kataldi.com'],
      path: '/_next/image',
      loader: 'default'
    },
    poweredByHeader: false,
  }
)
