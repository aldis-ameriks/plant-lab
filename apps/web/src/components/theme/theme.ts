import { setLightness } from 'polished'

const baseTheme = {
  navigation: {
    height: '63px'
  },
  footer: {
    height: '196px',
    heightMobile: '240px',
    margin: '80px'
  },
  boxShadow:
    '0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05), 0 6px 16px rgba(0, 0, 0, 0.05), 0 8px 32px rgba(0, 0, 0, 0.05)',
  maxWidth: '1200px',
  breakpoints: {
    mobile: '600px',
    tablet: '820px',
    desktop: '1000px'
  }
}

const colors = {
  light: {
    primary: '#8C1114',
    secondary: 'black',
    tertiary: 'black',
    quaternary: '#8C1114'
  },
  dark: {
    primary: '#004c6d',
    secondary: '#06ba86',
    tertiary: '#ffbe28',
    quaternary: '#00b2b9'
  }
}

export const theme = {
  ...baseTheme,
  colors: {
    ...colors.light,
    danger: '#dc3545',
    warning: '#ffc107',
    success: '#28a745',
    info: '#007bff',
    text: {
      title: setLightness(0.25, colors.light.primary),
      subtitle: setLightness(0.4, colors.light.primary),
      body: setLightness(0.18, colors.light.primary),
      inverted: {
        body: setLightness(0.95, colors.light.primary),
        link: setLightness(0.5, colors.light.secondary)
      },
      help: '#d3d3d3'
    },
    background: {
      smt: '#E6E6E6',
      primary: setLightness(0.95, colors.light.primary),
      secondary: setLightness(0.95, colors.light.secondary),
      tertiary: setLightness(0.9, colors.light.tertiary),
      quaternary: setLightness(0.95, colors.light.quaternary)
    }
  }
}

export const themeDark: typeof theme = theme
