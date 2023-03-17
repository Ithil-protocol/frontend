import { Button, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { FC, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAccount, useBalance, useContractWrite } from 'wagmi'

import TabsSwitch from 'src/components/composed/trade/TabsSwitch'
import { LendingToken } from 'src/types/onchain.types'

import { abbreviateBigNumber, bigNumberPercentage, stringInputToBigNumber } from './input.util'
import { useToken } from './use-token.hook'
import { useVault } from './use-vault.hook'

enum WidgetDirection {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

interface DepositWidgetProps {
  direction: WidgetDirection
  token: LendingToken
  tokenValue?: string // @todo:
}

const DepositWidget: FC<DepositWidgetProps> = ({ direction, token }) => {
  const operatingToken = direction === WidgetDirection.DEPOSIT ? token.tokenAddress : token.vaultAddress
  // state
  const [inputAmount, setInputAmount] = useState<string>('0')
  const { address } = useAccount()
  const inputBigNumber = stringInputToBigNumber(inputAmount, token.decimals)

  // web3 hooks
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: operatingToken,
    cacheTime: 5_000,
    watch: true,
  })
  const { useAllowance, useApprove } = useToken(operatingToken)
  const { usePrepareDeposit, usePrepareWithdraw } = useVault(token, address)

  const { data: allowance, refetch: refetchAllowance } = useAllowance(address, token.vaultAddress)
  const { isLoading: isApproveLoading, writeAsync: doApprove } = useApprove(token.vaultAddress, inputBigNumber)
  // deposit
  const { config: depositConfig, isError: isPrDepositError } = usePrepareDeposit(inputBigNumber)
  const { isLoading: isDepositLoading, writeAsync: deposit } = useContractWrite(depositConfig)
  // withdraw
  const { config: withdrawConfig, isError: isPrWithdrawError } = usePrepareWithdraw(inputBigNumber)
  const { isLoading: isWithdrawLoading, writeAsync: withdraw } = useContractWrite(withdrawConfig)

  // computed properties
  const isApproved = direction === WidgetDirection.WITHDRAW ? true : allowance?.gte(inputBigNumber) ?? false
  const isButtonLoading = isApproveLoading || isDepositLoading || isWithdrawLoading
  const isPrepareError = direction === WidgetDirection.DEPOSIT ? isPrDepositError : isPrWithdrawError
  const isInconsistent = inputBigNumber.gt(balance?.value ?? 0)
  const isButtonDisabled = isButtonLoading || isPrepareError || isInconsistent || inputBigNumber.isZero()
  const isMaxDisabled = inputBigNumber.eq(balance?.value ?? 0)
  console.log({
    isMaxDisabled,
    inputBigNumber: inputBigNumber.toString(),
    balanceValue: balance?.value.toString(),
  })

  const title = direction === WidgetDirection.DEPOSIT ? 'Deposit' : 'Withdraw'

  // handlers
  const handleMaxClick = () => {
    setInputAmount(balance?.formatted || '0')
  }

  const handleClick = async () => {
    if (direction === WidgetDirection.DEPOSIT) {
      if (!isApproved) {
        // after approval is successful, read again the allowance
        await doApprove?.()
        await refetchAllowance()
        return
      }
      await deposit?.()
    } else {
      await withdraw?.()
    }
    setInputAmount('0')
  }

  return (
    <div className="flex flex-col items-center w-full gap-2 p-3 md:p-6 rounded-xl border-1 border-font-200 dark:border-primary-300">
      <div className="flex flex-row justify-between w-full">
        <Text>{title}</Text>
        <div className="flex flex-row items-end justify-end gap-2">
          {isBalanceLoading ? (
            <Skeleton width={80} />
          ) : (
            <>
              <Text>{abbreviateBigNumber(balance?.value, token.decimals)}</Text>
              <Text>($ {abbreviateBigNumber(balance?.value, token.decimals)})</Text>
            </>
          )}
        </div>
      </div>

      <InputGroup size="md">
        <Input type="number" value={inputAmount} onChange={(event) => setInputAmount(event.target.value)} />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleMaxClick} isDisabled={isMaxDisabled} variant="insideInput">
            Max
          </Button>
        </InputRightElement>
      </InputGroup>

      <TabsSwitch
        activeIndex={'0'}
        onChange={(value: string) => {
          const percent = Number(value)
          setInputAmount(bigNumberPercentage(balance?.value, percent, token.decimals))
        }}
        items={[...Array(4)].map((_, idx) => ({
          title: `${(idx + 1) * 25}%`,
          value: `${(idx + 1) * 25}`,
        }))}
        theme="secondary"
      />

      <Button
        onClick={handleClick}
        isDisabled={isButtonDisabled}
        isLoading={isButtonLoading}
        loadingText={isButtonLoading ? 'Awaiting' : undefined}
      >
        {isApproved ? `${title} ${token.name}` : `Approve ${token.name}`}
      </Button>
    </div>
  )
}

interface Props {
  token: LendingToken
}

export const Deposit: FC<Props> = ({ token }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 sm:px-8 lg:px-16 xl:px-24 md:flex-row">
      <DepositWidget direction={WidgetDirection.DEPOSIT} token={token} />
      <DepositWidget direction={WidgetDirection.WITHDRAW} token={token} />
    </div>
  )
}
