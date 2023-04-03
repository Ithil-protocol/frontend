import { type ThemeConfig, extendTheme, withDefaultVariant } from '@chakra-ui/react'

const ithilTableStyle = {
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

const ithilButtonStyle = {
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
      color: 'var(--primary-100)',
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
      },
    },
  },
  defaultProps: {
    variant: 'ithil',
  },
}

const ithilInputStyle = {
  variants: {
    filled: {
      field: {
        bg: 'var(--primary-200)',
      },
    },
  },
  defaultProps: {
    variant: 'filled',
  },
}

const ithilTooltipStyle = {
  baseStyle: {
    borderRadius: 'var(--chakra-radii-lg)',
    px: 'var(--chakra-space-2)',
    py: 'var(--chakra-space-2)',
    textAlign: 'center',
  },
}

const ithilSkeletonStyle = {
  baseStyle: {
    '--skeleton-start-color': 'var(--skeleton-base-color)',
    '--skeleton-end-color': 'var(--skeleton-highlight-color)',
  },
  defaultProps: {
    height: '24px',
  },
}

const ithilHeadingStyle = {
  sizes: {
    h1: {
      fontSize: '32px',
      lineHeight: '51.2px',
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
        },
      },
    },
    colors: {
      bodyText: 'var(--font)',
    },
  },
  withDefaultVariant({
    variant: 'ithil',
    components: ['Table'],
  }),
)
