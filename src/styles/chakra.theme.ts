import { type StyleConfig, type ThemeConfig, extendTheme, withDefaultVariant } from '@chakra-ui/react'

const ithilTableStyle: StyleConfig = {
  variants: {
    ithil: () => ({
      table: {
        backgroundColor: 'var(--primary-100)',
        borderRadius: '12px',
        paddingTop: '20px',
      },
      th: {
        fontWeight: 'normal',
        fontSize: '16px',
      },
      tr: {
        borderBottom: '1px solid var(--primary-200)',
      },
    }),
  },
}

const ithilButtonStyle: StyleConfig = {
  variants: {
    insideInput: {
      backgroundColor: 'var(--primary-300)',
      borderColor: 'var(--primary-300)',
      borderWidth: '1px',
      _disabled: {
        backgroundColor: 'transparent',
        borderColor: 'var(--primary-400)',
      },
    },
    ithil: {
      backgroundColor: 'var(--primary-action)',
      color: 'var(--font-button)',
      display: 'block',
      width: '100%',
      fontSize: '18px',
      _hover: {
        _disabled: {
          backgroundColor: 'var(--button-hover-light)',
        },
      },
      _disabled: {
        backgroundColor: 'var(--primary-disabled)',
        border: '1px solid var(--primary-border)',
        color: 'var(--secondary)',
        opacity: 1,
      },
    },
  },
  defaultProps: {
    variant: 'ithil',
  },
}

const ithilInputStyle: StyleConfig = {
  baseStyle: {
    field: {
      fontSize: ['20px'],
      fontWeight: 'normal',
      lineHeight: '115%',
      bg: 'var(--primary-200)',
      background: 'var(--primary-200)',
    },
  },
}

const ithilTooltipStyle: StyleConfig = {
  baseStyle: {
    borderRadius: 'var(--chakra-radii-lg)',
    px: 'var(--chakra-space-2)',
    py: 'var(--chakra-space-2)',
    textAlign: 'center',
  },
}

const ithilSkeletonStyle: StyleConfig = {
  baseStyle: {
    '--skeleton-start-color': 'var(--skeleton-base-color)',
    '--skeleton-end-color': 'var(--skeleton-highlight-color)',
  },
}

const ithilHeadingStyle: StyleConfig = {
  sizes: {
    h1: {
      fontSize: ['24px', '32px'],
      lineHeight: ['38.4px', '51.2px'],
      fontWeight: 'normal',
    },
    h2: {
      fontSize: ['16px', '18px'],
      lineHeight: ['25.6px', '28.8px'],
      fontWeight: 'normal',
    },
  },
}

export const theme: ThemeConfig = extendTheme(
  {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    fonts: {
      body: 'var(--font-inter)',
      heading: 'var(--font-inter)',
    },
    components: {
      Table: ithilTableStyle,
      Button: ithilButtonStyle,
      Input: ithilInputStyle,
      Tooltip: ithilTooltipStyle,
      Skeleton: ithilSkeletonStyle,
      Heading: ithilHeadingStyle,
    },
    styles: {
      global: {
        body: {
          background: 'var(--primary)',
          color: 'var(--font)',
        },
      },
    },
    textStyles: {
      md: {
        fontSize: ['20px'],
        fontWeight: '600',
        lineHeight: '160%',
      },
    },
  },
  withDefaultVariant({
    variant: 'ithil',
    components: ['Table'],
  }),
)
