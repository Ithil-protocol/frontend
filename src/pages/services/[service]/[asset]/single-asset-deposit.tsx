import { Button, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { type FC, useState } from 'react'
import { type Address, useAccount, useBalance, useWaitForTransaction } from 'wagmi'

import { EstimatedValue } from '@/components/estimated-value'
import { Loading } from '@/components/loading'
import { useToken } from '@/hooks/use-token.hook'
import { useTransactionFeedback } from '@/hooks/use-transaction.hook'
import { type ServiceAsset } from '@/types/onchain.types'
import { abbreviateBigNumber, stringInputToBigNumber } from '@/utils/input.utils'

interface WidgetSingleAssetDepositProps {
  // data
  asset?: ServiceAsset
  balance?: BigNumber

  // actions
  inputAmount: string
  onInputChange: (amount: string) => void
  onActionClick: () => void
  onMaxClick: () => void

  // status
  isConnected: boolean
  isBalanceLoading: boolean
  isButtonDisabled: boolean
  isButtonLoading: boolean
  isMaxDisabled: boolean
  isApproved: boolean
}

export const WidgetSingleAssetDeposit: FC<WidgetSingleAssetDepositProps> = ({
  asset,
  balance,

  inputAmount,
  onInputChange,
  onActionClick,
  onMaxClick,

  isConnected,
  isBalanceLoading,
  isButtonDisabled,
  isButtonLoading,
  isMaxDisabled,
  isApproved,
}) => {
  const { openConnectModal } = useConnectModal()
  return (
    <div className="flex flex-col gap-2 p-3 bg-primary-100 rounded-xl">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">Deposit</Text>
        <div className="flex flex-row items-center justify-end gap-2">
          {isBalanceLoading ? (
            <Loading />
          ) : (
            <>
              <Text textStyle="slender-sm2">{abbreviateBigNumber(balance, asset!.decimals)}</Text>
              <Text textStyle="slender-sm2">
                (<EstimatedValue value={balance} token={asset!} />)
              </Text>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-1 justify-center px-2 rounded-md bg-primary-200 min-w-[92px]">
          {asset == null ? (
            <Loading />
          ) : (
            <>
              <div className="w-6 h-6">
                <Image
                  className="w-6 h-6"
                  src={`/assets/tokens/${asset.iconName}.svg`}
                  alt={`${asset.name} icon`}
                  height={24}
                  width={24}
                />
              </div>
              <Text textStyle="sm">{asset.name}</Text>
            </>
          )}
        </div>

        <InputGroup size="md">
          <Input
            type="number"
            step="0.1"
            variant="filled"
            value={inputAmount}
            onChange={(event) => onInputChange(event.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={onMaxClick} isDisabled={isMaxDisabled} variant="insideInput">
              Max
            </Button>
          </InputRightElement>
        </InputGroup>
      </div>

      {isConnected ? (
        <Button
          onClick={() => {
            void onActionClick()
          }}
          isDisabled={isButtonDisabled}
          isLoading={isButtonLoading}
          loadingText={isButtonLoading ? 'Awaiting' : undefined}
        >
          {asset == null ? 'Loading...' : isApproved ? 'Open position' : `Approve ${asset.name}`}
        </Button>
      ) : (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      )}
    </div>
  )
}

interface ServiceDepositProps {
  asset: ServiceAsset
  serviceAddress: Address
}

export const ServiceDeposit: FC<ServiceDepositProps> = ({ asset, serviceAddress }) => {
  const { address, isConnected } = useAccount()
  // const { data: signer } = useSigner()
  const [inputAmount, setInputAmount] = useState<string>('0')
  const inputBigNumber = stringInputToBigNumber(inputAmount, asset.decimals)

  // web3 hooks
  const { trackTransaction } = useTransactionFeedback()

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: asset.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  })
  const { useAllowance, useApprove } = useToken(asset.tokenAddress)
  const { data: allowance, refetch: refetchAllowance } = useAllowance(address, serviceAddress)
  const {
    data: approveData,
    isLoading: isApproveLoading,
    writeAsync: approve,
  } = useApprove(serviceAddress, inputBigNumber)
  const { isLoading: isApproveWaiting } = useWaitForTransaction({ hash: approveData?.hash })

  // const order = prepareOrder(asset.tokenAddress, inputBigNumber, 2)
  // const { config: openConfig } = usePrepareContractWrite({
  //   address: serviceAddress,
  //   abi: serviceAbi,
  //   functionName: 'open',
  //   args: [order],
  // })

  // const serviceContract = useContract({ address: serviceAddress, abi: serviceAbi, signerOrProvider: signer })

  // const { config: depositConfig } = usePrepareDeposit(inputBigNumber)
  // const { data: depositData, isLoading: isDepositLoading, writeAsync: deposit } = useContractWrite(depositConfig)

  // computed properties
  const isApproved = allowance?.gte(inputBigNumber) ?? false
  const isButtonLoading = isApproveLoading || isApproveWaiting
  const isInconsistent = inputBigNumber.gt(balance?.value ?? 0)
  const isButtonDisabled = isButtonLoading || isInconsistent || inputBigNumber.isZero()
  const isMaxDisabled = inputBigNumber.eq(balance?.value ?? 0)

  const onInputChange = (amount: string) => {
    setInputAmount(amount)
  }
  const onActionClick = async () => {
    if (!isApproved) {
      const result = await approve?.()
      await trackTransaction(result, `Approve ${inputAmount} ${asset.name}`)
      await refetchAllowance()
    }
    // FIXME: rewrite this
    // const order = prepareOrder(asset.tokenAddress, inputBigNumber, 2)
    // console.log({ order: JSON.parse(JSON.stringify(order)) })

    // const unsignedTx = await serviceContract?.populateTransaction.open(order)
    // console.log({ unsignedTx })
    // const response = await serviceContract?.open(order)
    // console.log({ response })
  }
  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? '0')
  }

  return (
    <WidgetSingleAssetDeposit
      inputAmount={inputAmount}
      balance={balance?.value ?? BigNumber.from(0)}
      onInputChange={onInputChange}
      onActionClick={onActionClick}
      onMaxClick={onMaxClick}
      isConnected={isConnected}
      isBalanceLoading={isBalanceLoading}
      isButtonDisabled={isButtonDisabled}
      isButtonLoading={isButtonLoading}
      isMaxDisabled={isMaxDisabled}
      isApproved={isApproved}
      asset={asset}
    />
  )
}

export const DynamicServiceDeposit = dynamic(
  async () => await import('@/pages/services/[service]/[asset]/single-asset-deposit').then((mod) => mod.ServiceDeposit),
  {
    ssr: false,
    loading: () => (
      <WidgetSingleAssetDeposit
        inputAmount="0"
        onInputChange={() => {}}
        onActionClick={() => {}}
        onMaxClick={() => {}}
        isConnected={false}
        isBalanceLoading={true}
        isButtonDisabled={true}
        isButtonLoading={false}
        isMaxDisabled={false}
        isApproved={false}
      />
    ),
  },
)
