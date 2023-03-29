import { Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react'
import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import { type FC, Fragment, useState } from 'react'

import { DynamicEstimatedValue } from '@/components/estimated-value'
import { Loading } from '@/components/loading'
import PageWrapper from '@/components/page-wrapper'
import { placeHolderVaultData, useVaults } from '@/pages/lend/use-vaults.hook'
import { type Vaults } from '@/types/onchain.types'

import { Deposit } from './deposit'

type Columns = 'asset' | 'apy' | 'tvl' | 'borrowed' | 'deposited' | 'info'

const mobileHiddenColumnClass = 'hidden md:table-cell'
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
]

const Lend: FC = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const { data: vaultData, isError: isVaultsError, isLoadingError, isLoading } = useVaults()
  // computed values
  const vaultDataWithFallback = vaultData ?? placeHolderVaultData
  const isVaultsLoading = isLoading || isLoadingError

  const onSelectedChange = (idx: number) => {
    // not sure this check is necessary
    const vault = vaultData?.[idx]
    if (vault == null) return
    // clicking on selected row will unselect it
    if (selectedRow === idx) return setSelectedRow(null)
    return setSelectedRow(idx)
  }

  return (
    <>
      <Head>
        <title>Ithil - Lending</title>
        <meta name="description" content="Official frontend for Ithil strategies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper heading="Lend">
        <TableContainer className="w-full rounded-xl bg-primary-100 lg:p-6">
          <Table size="md">
            <Thead>
              <Tr>
                {columns.map((column) => (
                  <Th key={column.key} className={classNames(['normal-case', column.className])}>
                    <div className="flex items-center gap-2">
                      <Tooltip label={column.tooltip} isDisabled={column.tooltip == null} closeDelay={500}>
                        <Text className={classNames({ 'cursor-help': column.tooltip })}>
                          {column.hideText !== true && column.text}
                          {column.tooltip != null && '❔'}
                        </Text>
                      </Tooltip>
                    </div>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {vaultDataWithFallback.map((vault: Vaults[number], idx) => (
                <Fragment key={idx}>
                  <Tr
                    onClick={() => onSelectedChange(idx)}
                    className={classNames([
                      'cursor-pointer',
                      'hover:bg-primary-200',
                      selectedRow === idx && 'border-none bg-primary-300',
                    ])}
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/assets/svg-icons/${vault.token.iconName}.svg`}
                          alt={`${vault.token.name} icon`}
                          height={32}
                          width={32}
                        ></Image>
                        <Text className="uppercase">{vault.token.name}</Text>
                      </div>
                    </Td>
                    <Td>
                      <Loading />
                    </Td>
                    <Td>
                      {isVaultsLoading || (isVaultsError && <Loading />)}
                      <DynamicEstimatedValue value={vault.tvl} token={vault.token} />
                    </Td>
                    <Td className={mobileHiddenColumnClass}>
                      {isVaultsLoading || (isVaultsError && <Loading />)}
                      <DynamicEstimatedValue value={vault.borrowed} token={vault.token} />
                    </Td>
                    <Td className={mobileHiddenColumnClass}>
                      {isVaultsLoading || (isVaultsError && <Loading />)}
                      <DynamicEstimatedValue value={vault.deposited} token={vault.token} />
                    </Td>
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
      </PageWrapper>
    </>
  )
}

export default Lend
