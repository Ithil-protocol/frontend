import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import classNames from 'classnames'
import { FC, useState } from 'react'
import TabsSwitch from 'src/components/composed/trade/TabsSwitch'
import { LendingToken } from 'src/types/onchain.types'
import { useAccount, useBalance } from 'wagmi'

interface DepositWidgetProps {
  title: string
  token: LendingToken
  tokenValue?: string // @todo:
  onClick: (value: BigNumber) => void
}

const DepositWidget: FC<DepositWidgetProps> = ({ title, token }) => {
  const [inputAmount, setInputAmount] = useState(0)
  const [marginMaxPercent, setMarginMaxPercent] = useState<string>('1')
  const { address } = useAccount()
  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    address,
    token: token.tokenAddress,
    cacheTime: 5_000,
  })

  const isApproved = false

  const handleMaxClick = () => {}

  return (
    <div className="my-3 flex flex-col items-center justify-between gap-2 rounded-xl border-1 border-font-200 bg-primary-100 p-6 dark:border-primary-400">
      <div className="flex w-full flex-row justify-between">
        <Text>{title}</Text>
        <div className="flex items-center gap-2">
          <Text>{balance?.formatted}</Text>
          <Text>($ {balance?.formatted})</Text>
        </div>
      </div>

      <InputGroup size="md">
        <Input
          type="number"
          value={inputAmount}
          onChange={(event) => setInputAmount(parseFloat(event.target.value))}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleMaxClick}>
            Max
          </Button>
        </InputRightElement>
      </InputGroup>

      <TabsSwitch
        activeIndex={marginMaxPercent}
        onChange={(value: string) => {
          console.log({ value })
        }}
        items={[...Array(4)].map((_, idx) => ({
          title: `${(idx + 1) * 25}%`,
          value: `${(idx + 1) * 25}`,
        }))}
        theme="secondary"
      />

      <Button>{isApproved ? title : `Approve ${token.name}`}</Button>
    </div>
  )
}

interface Props {
  token: LendingToken
}

export const Deposit: FC<Props> = ({ token }) => {
  return (
    <div
      className={classNames([
        'flex flex-col items-center justify-center gap-4',
        'md:flex-row',
      ])}
    >
      <DepositWidget
        title="Deposit"
        token={token}
        onClick={() => console.log('not yet implemented')}
      />
      <DepositWidget
        title="Withdraw"
        token={token}
        onClick={() => console.log('not yet implemented')}
      />
    </div>
  )
}
