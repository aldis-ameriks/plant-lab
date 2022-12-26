import { config } from '../config'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(url: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window === 'undefined' || !(window as any).gtag) {
    console.warn('Calling pageview server side is not supported')
    return
  }

  if (url === `${window.location.pathname}${window.location.search}`) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-extra-semi
  ;(window as any).gtag('config', config.analytics.trackingId, {
    page_path: url
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event({
  action,
  category,
  label,
  value
}: {
  action: string
  category: string
  label: string
  value: string
}): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window === 'undefined' || !(window as any).gtag) {
    console.warn('Calling event server side is not supported')
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-extra-semi
  ;(window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value
  })
}
