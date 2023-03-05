import { Row, Table } from '@nextui-org/react'
import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'
import Skeleton from 'react-loading-skeleton'

import Page from 'src/components/based/Page'
import Tooltip from 'src/components/based/Tooltip'
import Txt from 'src/components/based/Txt'
import { PropsWithClassName } from 'src/types/components.types'
import { Vaults } from 'src/types/onchain.types'
import { placeHolderVaultData, useVaults } from 'src/pages/lend/use-vaults.hook'

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

  const renderCell = (vault: Vaults[number], columnKey: React.Key) => {
    const column = columnKey as Columns
    const loading = (width = 60) => (
      <Table.Cell>
        <Skeleton width={width} />
      </Table.Cell>
    )
    if (column === 'asset') {
      return (
        <Table.Cell css={{ padding: '$space$8' }}>
          <div className="flex items-center gap-2">
            <img
              src={require(`cryptocurrency-icons/svg/icon/${vault.token.iconName}.svg`)}
              alt={`${vault.token.name} icon`}
            />
            <Txt.Body2Regular className="uppercase">
              {vault.token.name}
            </Txt.Body2Regular>
          </div>
        </Table.Cell>
      )
    }

    if (column === 'apy') return loading()
    if (column === 'tvl') {
      if (vaultIsLoading || vaultIsError) return loading()
      return <Table.Cell>{vault.tvl?.toString()}</Table.Cell>
    }
    if (column === 'borrowed') {
      if (vaultIsLoading || vaultIsError) return loading()
      return <Table.Cell>{vault.borrowed?.toString()}</Table.Cell>
    }
    if (column === 'deposited') {
      if (vaultIsLoading || vaultIsError) return loading()
      return <Table.Cell>{vault.deposited?.toString()}</Table.Cell>
    }
    if (column === 'info') return <Table.Cell>{null}</Table.Cell>
    return <Table.Cell>{null}</Table.Cell>
  }

  return (
    <Page heading="Lend">
      <Wrapper>
        <Table
          lined
          headerLined
          selectionMode="single"
          aria-label="Lending tokens available and their APY, TVL, borrowed and deposited amounts"
          css={{
            height: 'auto',
            minWidth: '100%',
            backgroundColor: '$background',
          }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.key} hideHeader={column.hideText}>
                <Row className="items-center gap-2">
                  <Txt.Body2Regular className="text-font-100">
                    {column.text}
                  </Txt.Body2Regular>
                  {column.tooltip && <Tooltip text={column.tooltip} />}
                </Row>
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={vaultDataWithFallback}>
            {(vault) => (
              <Table.Row>
                {(columnKey) => renderCell(vault, columnKey)}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Wrapper>
    </Page>
  )
}

export default LendPage
