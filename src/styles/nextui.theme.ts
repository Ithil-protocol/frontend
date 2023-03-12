import { createTheme } from '@nextui-org/react'

export const uiDark = createTheme({
  type: 'dark',
  theme: {
    colors: {
      text: '#F2F5F6',
      background: '#151A29',
      selection: '$gray900',
      primaryLight: 'var(--aprimary-200)',
      primaryLightContrast: 'var(--asecondary-200)',
      border: 'var(--asecondary-400)',
    },
  }
})
