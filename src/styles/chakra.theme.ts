import { defineStyleConfig, extendBaseTheme } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import { merge } from 'lodash'

const { Button, Table, Input } = chakraTheme.components

const ithilTableStyle = {
  variants: {
    ithil: () => ({
      table: {
        backgroundColor: 'var(--aprimary-100)',
        borderRadius: '12px',
        paddingTop: '20px',
      },
      tr: {
        borderBottom: '1px solid var(--aprimary-200)',
      },
    }),
  },
}

const ithilButtonStyle = {
  defaultProps: {
    colorScheme: 'ithil',
  },
}

const ithilInputStyle = {
  variants: {
    filled: {
      field: {
        bg: 'var(--aprimary-200)',
      },
    },
  },
  defaultProps: {
    variant: 'filled',
  },
}

const IthilTable = defineStyleConfig(merge(Table, ithilTableStyle))
const IthilButton = defineStyleConfig(merge(Button, ithilButtonStyle))
const IthilInput = defineStyleConfig(merge(Input, ithilInputStyle))

export const theme = extendBaseTheme({
  fonts: {
    body: 'Raleway, serif',
  },
  colors: {
    ithil: {
      500: 'var(--aprimary-action)', // used in button
    },
  },
  components: {
    Button: IthilButton,
    Table: IthilTable,
    Input: IthilInput,
  },
})
