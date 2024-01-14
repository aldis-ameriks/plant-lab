/* eslint-disable react/no-danger */
import crypto from 'crypto'
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

import { GlobalStyles } from '../components/theme/GlobalStyles'
import { config } from '../helpers/config'

function cspHashOf(text: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}

function getGtmScript(): string {
  return `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${config.analytics.gtmId}');
  `
}

export default class MyDocument extends Document<{ isProduction: boolean }> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & { isProduction: boolean }> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(
              <>
                <GlobalStyles />
                <App {...props} />
              </>
            )
        })

      const initialProps = await Document.getInitialProps(ctx)

      // Check if in production
      const isProduction = process.env.NODE_ENV === 'production'

      return {
        ...initialProps,
        isProduction,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render(): React.ReactElement {
    const inlineScriptSource = NextScript.getInlineScriptSource(this.props)
    const hashes = `${cspHashOf(inlineScriptSource)} ${cspHashOf(getGtmScript())}`

    const analyticsSources = 'https://www.googletagmanager.com https://www.google-analytics.com'
    const domains = '*.aldisameriks.dev wss://*.aldisameriks.dev'
    let csp = `default-src 'self' ${domains} data:; img-src 'self' data: blob: ${domains} ${analyticsSources} https://*.digitaloceanspaces.com; connect-src 'self' ${domains} ${analyticsSources} https://*.sentry.io https://sentry.io; script-src 'self' ${domains} ${analyticsSources} ${hashes}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com;`
    if (process.env.NODE_ENV !== 'production') {
      csp = `default-src 'self' localhost:* ${domains} data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' localhost:* data: https://*.digitaloceanspaces.com; font-src 'self' data: https://fonts.gstatic.com; script-src 'unsafe-eval' 'self' ${analyticsSources} ${hashes}; connect-src 'self' ws://localhost:* http://localhost:* ${domains} ${analyticsSources} https://*.sentry.io https://sentry.io`
    }

    return (
      <Html lang="en">
        <Head>
          <title>Plants</title>
          <meta httpEquiv="Content-Security-Policy" content={csp} />
          {config.analytics.gtmId && <script dangerouslySetInnerHTML={{ __html: getGtmScript() }} />}
          {config.analytics.trackingId && (
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.analytics.trackingId}`} />
          )}
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          {config.analytics.gtmId && (
            <noscript>
              <iframe
                title="gtm"
                src={`https://www.googletagmanager.com/ns.html?id=${config.analytics.gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
