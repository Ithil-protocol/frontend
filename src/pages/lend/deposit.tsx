import { Button, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { FC, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Address, useAccount, useBalance, useContractWrite } from 'wagmi'

import TabsSwitch from 'src/components/composed/trade/TabsSwitch'
import { LendingToken } from 'src/types/onchain.types'

import { abbreviateBigNumber, bigNumberPercentage, estimateTokenValue, stringInputToBigNumber } from './input.util'
import { useTokenData } from './use-token-data.hook'
import { useToken } from './use-token.hook'
import { useVault } from './use-vault.hook'

// this is the presentational component
interface WidgetComponentProps {
  title: string
  balance: BigNumber | undefined

  tokenName: string
  tokenDecimals: number
  tokenValue: number | undefined

  inputAmount: string
  onInputChange: (value: string) => void
  onMaxClick: () => void
  onPercentageClick: (value: string) => void
  onActionClick: () => Promise<void>

  isBalanceLoading: boolean
  isButtonDisabled: boolean
  isButtonLoading: boolean
  isApproved: boolean
  isMaxDisabled: boolean
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  title,
  balance,

  tokenName,
  tokenDecimals,
  tokenValue,

  inputAmount,
  onInputChange,
  onMaxClick,
  onPercentageClick,
  onActionClick,

  isBalanceLoading,
  isMaxDisabled,
  isButtonDisabled,
  isButtonLoading,
  isApproved,
}) => {
  return (
    <div className="flex flex-col items-center w-full gap-2 p-3 md:p-6 rounded-xl border-1 border-font-200 dark:border-primary-300">
      <div className="flex flex-row justify-between w-full">
        <Text>{title}</Text>
        <div className="flex flex-row items-end justify-end gap-2">
          {isBalanceLoading ? (
            <Skeleton width={80} />
          ) : (
            <>
              <Text>{abbreviateBigNumber(balance, tokenDecimals)}</Text>
              <Text>($ {estimateTokenValue(balance, tokenDecimals, tokenValue)})</Text>
            </>
          )}
        </div>
      </div>

      <InputGroup size="md">
        <Input type="number" value={inputAmount} onChange={(event) => onInputChange(event.target.value)} />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={onMaxClick} isDisabled={isMaxDisabled} variant="insideInput">
            Max
          </Button>
        </InputRightElement>
      </InputGroup>

      <TabsSwitch
        activeIndex={'0'}
        onChange={(value: string) => {
          const percent = Number(value)
          onPercentageClick(bigNumberPercentage(balance, percent, tokenDecimals))
        }}
        items={[...Array(4)].map((_, idx) => ({
          title: `${(idx + 1) * 25}%`,
          value: `${(idx + 1) * 25}`,
        }))}
        theme="secondary"
      />

      <Button
        onClick={onActionClick}
        isDisabled={isButtonDisabled}
        isLoading={isButtonLoading}
        loadingText={isButtonLoading ? 'Awaiting' : undefined}
      >
        {isApproved ? `${title} ${tokenName}` : `Approve ${tokenName}`}
      </Button>
    </div>
  )
}

interface LendingProps {
  token: LendingToken
}

export const LendingDeposit: FC<LendingProps> = ({ token }) => {
  // state
  const [inputAmount, setInputAmount] = useState<string>('0')
  const { address } = useAccount()
  const inputBigNumber = stringInputToBigNumber(inputAmount, token.decimals)

  // web3 hooks
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: token.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  })
  const { useAllowance, useApprove } = useToken(token.tokenAddress)
  const { usePrepareDeposit } = useVault(token, address)
  const { data: tokenData } = useTokenData()

  const { data: allowance, refetch: refetchAllowance } = useAllowance(address, token.vaultAddress)
  const { isLoading: isApproveLoading, writeAsync: doApprove } = useApprove(token.vaultAddress, inputBigNumber)
  // deposit
  const { config: depositConfig, isError: isPrDepositError } = usePrepareDeposit(inputBigNumber)
  const { isLoading: isDepositLoading, writeAsync: deposit } = useContractWrite(depositConfig)

  // computed properties
  const isApproved = allowance?.gte(inputBigNumber) ?? false
  const isButtonLoading = isApproveLoading || isDepositLoading
  const isPrepareError = isPrDepositError
  const isInconsistent = inputBigNumber.gt(balance?.value ?? 0)
  const isButtonDisabled = isButtonLoading || isPrepareError || isInconsistent || inputBigNumber.isZero()
  const isMaxDisabled = inputBigNumber.eq(balance?.value ?? 0)
  const tokenValue = tokenData?.[token.tokenAddress.toLowerCase() as Address].usd

  /**
   * withdraw logic
   * inputBigNumber will contain the amount of Shares to withdraw
   * if the user clicks Max or 100%, set the inputAmount to the balance
   * otherwise, convert the string input via convertToShares
   */

  // handlers
  const handleMaxClick = () => {
    setInputAmount(balance?.formatted || '0')
  }

  const handleClick = async () => {
    if (!isApproved) {
      // after approval is successful, read again the allowance
      await doApprove?.()
      await refetchAllowance()
      return
    }
    await deposit?.()
    setInputAmount('0')
  }

  return (
    <WidgetComponent
      title={'Deposit'}
      balance={balance?.value ?? BigNumber.from(0)}
      tokenName={token.name}
      tokenDecimals={token.decimals}
      tokenValue={tokenValue}
      inputAmount={inputAmount}
      onInputChange={setInputAmount}
      onMaxClick={handleMaxClick}
      onPercentageClick={setInputAmount}
      onActionClick={handleClick}
      isBalanceLoading={isBalanceLoading}
      isMaxDisabled={isMaxDisabled}
      isButtonDisabled={isButtonDisabled}
      isButtonLoading={isButtonLoading}
      isApproved={isApproved}
    />
  )
}

export const LendingWithdraw: FC<LendingProps> = ({ token }) => {
  // state
  const [inputAmount, setInputAmount] = useState<string>('0')
  const { address } = useAccount()
  const inputBigNumber = stringInputToBigNumber(inputAmount, token.decimals)

  // web3 hooks
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: token.vaultAddress,
    cacheTime: 5_000,
    watch: true,
  })
  const { usePrepareWithdraw } = useVault(token, address)
  const { data: tokenData } = useTokenData()

  // withdraw
  const { config: withdrawConfig, isError: isPrWithdrawError } = usePrepareWithdraw(inputBigNumber)
  const { isLoading: isWithdrawLoading, writeAsync: withdraw } = useContractWrite(withdrawConfig)

  // computed properties
  const isButtonLoading = isWithdrawLoading
  const isPrepareError = isPrWithdrawError
  const isInconsistent = inputBigNumber.gt(balance?.value ?? 0)
  const isButtonDisabled = isButtonLoading || isPrepareError || isInconsistent || inputBigNumber.isZero()
  const isMaxDisabled = inputBigNumber.eq(balance?.value ?? 0)
  const tokenValue = tokenData?.[token.tokenAddress.toLowerCase() as Address].usd

  /**
   * withdraw logic
   * inputBigNumber will contain the amount of Shares to withdraw
   * if the user clicks Max or 100%, set the inputAmount to the balance
   * otherwise, convert the string input via convertToShares
   */

  // handlers
  const handleMaxClick = () => {
    setInputAmount(balance?.formatted || '0')
  }

  const handleClick = async () => {
    await withdraw?.()
    setInputAmount('0')
  }

  return (
    <WidgetComponent
      title={'Withdraw'}
      balance={balance?.value ?? BigNumber.from(0)}
      tokenName={token.name}
      tokenDecimals={token.decimals}
      tokenValue={tokenValue}
      inputAmount={inputAmount}
      onInputChange={setInputAmount}
      onMaxClick={handleMaxClick}
      onPercentageClick={setInputAmount}
      onActionClick={handleClick}
      isBalanceLoading={isBalanceLoading}
      isMaxDisabled={isMaxDisabled}
      isButtonDisabled={isButtonDisabled}
      isButtonLoading={isButtonLoading}
      isApproved={true}
    />
  )
}

interface LendingProps {
  token: LendingToken
}

export const Deposit: FC<LendingProps> = ({ token }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 sm:px-8 lg:px-16 xl:px-24 md:flex-row">
      <LendingDeposit token={token} />
      <LendingWithdraw token={token} />
    </div>
  )
}
