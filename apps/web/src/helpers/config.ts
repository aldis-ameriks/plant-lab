export const config = {
  commitHash: process.env.NEXT_PUBLIC_COMMIT_HASH || 'development',
  captureErrors: process.env.NEXT_PUBLIC_CAPTURE_ERRORS === 'true',
  mockGraphql: process.env.NEXT_PUBLIC_MOCK_GRAPHQL === 'true',
  api: {
    baseUrl: process.env.FRONTEND_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
  },
  analytics: {
    trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID
  }
}
