import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import classNames from 'classnames'
import { FC, Fragment, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import Page from 'src/components/based/Page'
import Tooltip from 'src/components/based/Tooltip'
import Txt from 'src/components/based/Txt'
import { placeHolderVaultData, useVaults } from 'src/pages/lend/use-vaults.hook'
import { PropsWithClassName } from 'src/types/components.types'
import { Vaults } from 'src/types/onchain.types'

import { Deposit } from './deposit'

const Wrapper: FC<PropsWithClassName> = ({ children, className }) => (
  <div
    className={classNames([
      'text-secondary',
      'mobile:w-full mobile:flex-col mobile:items-start',
      'tablet:items-center',
      className,
    ])}
  >
    {children}
  </div>
)

type Columns = 'asset' | 'apy' | 'tvl' | 'borrowed' | 'deposited' | 'info'

const Loading: FC<{ width?: number }> = ({ width = 60 }) => <Skeleton width={width} />

const mobileHiddenColumnClass = 'hidden sm:table-cell'
const columns: Array<{
  text: string
  key: Columns
  tooltip?: string
  hideText?: boolean
  className?: string
}> = [
  { text: 'Asset', key: 'asset' },
  {
    text: 'APY',
    key: 'apy',
    tooltip: 'Annual Percentage Yield, your ROI on the deposit',
  },
  {
    text: 'TVL',
    key: 'tvl',
    tooltip: 'Total value locked, how many tokens have been deposited',
  },
  {
    text: 'Borrowed',
    key: 'borrowed',
    tooltip: 'How many tokens are currently lent to risk-takers',
    className: mobileHiddenColumnClass,
  },
  {
    text: 'Deposited',
    key: 'deposited',
    tooltip: 'How many tokens are currently deposited',
    className: mobileHiddenColumnClass,
  },
  { text: 'Info', key: 'info', hideText: true, className: 'hidden md:table-cell' },
]

const LendPage: FC = () => {
  const { data: vaultData, isLoading: vaultIsLoading, isError: vaultIsError } = useVaults()
  const vaultDataWithFallback = vaultIsError ? placeHolderVaultData : vaultData

  const [selectedRow, setSelectedRow] = useState<number | null>(null)

  const onSelectedChange = (idx: number) => {
    // not sure this check is necessary
    const vault = vaultData?.[idx]
    if (vault == null) return
    // clicking on selected row will unselect it
    if (selectedRow === idx) return setSelectedRow(null)
    return setSelectedRow(idx)
  }

  return (
    <Page heading="Lend">
      <Wrapper>
        <TableContainer className={classNames(['rounded-xl bg-primary-100 lg:p-6'])}>
          <Table size="md" variant={'ithil'}>
            <Thead>
              <Tr>
                {columns.map((column) => (
                  <Th key={column.key} className={classNames(['normal-case', column.className])}>
                    <div className="flex items-center gap-2">
                      <Txt.Body2Regular className="text-font-100">
                        {column.hideText != true && column.text}
                      </Txt.Body2Regular>
                      {column.tooltip && <Tooltip text={column.tooltip} />}
                    </div>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {vaultDataWithFallback!.map((vault: Vaults[number], idx) => (
                <Fragment key={idx}>
                  <Tr
                    onClick={() => onSelectedChange(idx)}
                    className={classNames([
                      'cursor-pointer',
                      'hover:bg-primary-200',
                      selectedRow === idx && 'border-none',
                    ])}
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <img
                          src={require(`cryptocurrency-icons/svg/icon/${vault.token.iconName}.svg`)}
                          alt={`${vault.token.name} icon`}
                        />
                        <Txt.Body2Regular className="uppercase">{vault.token.name}</Txt.Body2Regular>
                      </div>
                    </Td>
                    <Td>
                      <Loading />
                    </Td>
                    <Td>
                      {(vaultIsLoading || vaultIsError) && <Loading />}
                      {vault.tvl?.toString()}
                    </Td>
                    <Td className={mobileHiddenColumnClass}>
                      {(vaultIsLoading || vaultIsError) && <Loading />}
                      {vault.borrowed?.toString()}
                    </Td>
                    <Td className={mobileHiddenColumnClass}>
                      {(vaultIsLoading || vaultIsError) && <Loading />}
                      {vault.deposited?.toString()}
                    </Td>
                    <Td className="hidden md:table-cell">{null}</Td>
                  </Tr>
                  {selectedRow === idx && (
                    <Tr>
                      <Td colSpan={columns.length}>
                        <Deposit token={vaultData![idx].token} />
                      </Td>
                    </Tr>
                  )}
                </Fragment>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Wrapper>
    </Page>
  )
}

export default LendPage
