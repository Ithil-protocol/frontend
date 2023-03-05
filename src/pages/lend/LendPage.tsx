import type { FC } from 'react'

import { Row, Table } from '@nextui-org/react'

import Page from 'src/components/based/Page'
import classNames from 'classnames'
import Txt from 'src/components/based/Txt'
import Tooltip from 'src/components/based/Tooltip'
import { PropsWithClassName } from 'src/types/components.types'
import { TokenList } from 'src/types/onchain.types'

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

const LendPage: FC = () => {
  const sortedTokens: TokenList = []

  const columns = [
    { text: 'Asset' },
    {
      text: 'APY',
      tooltip: 'Annual Percentage Yield, your ROI on the deposit',
    },
    {
      text: 'TVL',
      tooltip: 'Total value locked, how many tokens have been deposited',
    },
    {
      text: 'Borrowed',
      tooltip: 'How many tokens are currently lent to risk-takers',
    },
    {
      text: 'Deposited',
      tooltip: 'How many tokens are currently deposited',
    },
    { text: 'Info', hideText: true },
  ]

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
          }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.text} hideHeader={column.hideText}>
                <Row className="items-center gap-2">
                  <Txt.Body2Regular className="text-font-100">
                    {column.text}
                  </Txt.Body2Regular>
                  {column.tooltip && <Tooltip text={column.tooltip} />}
                </Row>
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body>
            <Table.Row key="1">
              <Table.Cell>Tony Reichert</Table.Cell>
              <Table.Cell>CEO</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>{null}</Table.Cell>
            </Table.Row>
            <Table.Row key="2">
              <Table.Cell>Zoey Lang</Table.Cell>
              <Table.Cell>Technical Lead</Table.Cell>
              <Table.Cell>Paused</Table.Cell>
              <Table.Cell>Paused</Table.Cell>
              <Table.Cell>Paused</Table.Cell>
              <Table.Cell>{null}</Table.Cell>
            </Table.Row>
            <Table.Row key="3">
              <Table.Cell>Jane Fisher</Table.Cell>
              <Table.Cell>Senior Developer</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>{null}</Table.Cell>
            </Table.Row>
            <Table.Row key="4">
              <Table.Cell>William Howard</Table.Cell>
              <Table.Cell>Community Manager</Table.Cell>
              <Table.Cell>Vacation</Table.Cell>
              <Table.Cell>Vacation</Table.Cell>
              <Table.Cell>Vacation</Table.Cell>
              <Table.Cell>{null}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Wrapper>
    </Page>
  )
}

export default LendPage
