import classNames from 'classnames'
import React, { FC, Fragment } from 'react'
import Skeleton from 'react-loading-skeleton'

import Page from 'src/components/based/Page'
import Tooltip from 'src/components/based/Tooltip'
import Txt from 'src/components/based/Txt'
import { PropsWithClassName } from 'src/types/components.types'
import { Vaults } from 'src/types/onchain.types'
import { placeHolderVaultData, useVaults } from 'src/pages/lend/use-vaults.hook'
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

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

const Loading: FC<{ width?: number }> = ({ width = 60 }) => (
  <Skeleton width={width} />
)

const LendPage: FC = () => {
  const columns: Array<{
    text: string
    key: Columns
    tooltip?: string
    hideText?: boolean
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
    },
    {
      text: 'Deposited',
      key: 'deposited',
      tooltip: 'How many tokens are currently deposited',
    },
    { text: 'Info', key: 'info', hideText: true },
  ]

  const {
    data: vaultData,
    isLoading: vaultIsLoading,
    isError: vaultIsError,
  } = useVaults()
  const vaultDataWithFallback = vaultIsError ? placeHolderVaultData : vaultData

  const [selectedRow, setSelectedRow] = React.useState<number | null>(null)

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
        <TableContainer>
          <Table size="md">
            <Thead>
              <Tr>
                {columns.map((column) => (
                  <Th key={column.key} className="normal-case">
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
                    ])}
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <img
                          src={require(`cryptocurrency-icons/svg/icon/${vault.token.iconName}.svg`)}
                          alt={`${vault.token.name} icon`}
                        />
                        <Txt.Body2Regular className="uppercase">
                          {vault.token.name}
                        </Txt.Body2Regular>
                      </div>
                    </Td>
                    <Td>
                      <Loading />
                    </Td>
                    <Td>
                      {(vaultIsLoading || vaultIsError) && <Loading />}
                      {vault.tvl?.toString()}
                    </Td>
                    <Td>
                      {(vaultIsLoading || vaultIsError) && <Loading />}
                      {vault.borrowed?.toString()}
                    </Td>
                    <Td>
                      {(vaultIsLoading || vaultIsError) && <Loading />}
                      {vault.deposited?.toString()}
                    </Td>
                    <Td>{null}</Td>
                  </Tr>
                  {selectedRow === idx && (
                    <Tr>
                      <Td colSpan={columns.length}>Deposit Interface -HERE-</Td>
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
