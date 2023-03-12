import { defineStyleConfig, extendBaseTheme, StyleFunctionProps } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import { merge } from 'lodash'

const { Button, Table } = chakraTheme.components

const ithilVariant = {
  variants: {
    ithil: (props: StyleFunctionProps) => ({
      table: {
        backgroundColor: 'var(--aprimary-100)',
        borderRadius: '12px',
        paddingTop: '20px',
      },
      tr: {
        borderBottom: '1px solid var(--aprimary-200)',
      }
    })
  }
}
const IthilTable = defineStyleConfig(merge(Table, ithilVariant))

export const theme = extendBaseTheme({
  components: {
    Button,
    Table: IthilTable,
  },
})
