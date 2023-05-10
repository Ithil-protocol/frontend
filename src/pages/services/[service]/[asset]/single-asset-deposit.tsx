import { Button, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { type BigNumber } from '@ethersproject/bignumber'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { type FC, useState } from 'react'
import { type Address, useAccount, useContract, useSigner } from 'wagmi'

import { EstimatedValue } from '@/components/estimated-value'
import { Loading } from '@/components/loading'
import { useToken } from '@/hooks/use-token.hook'
import { useTransactionFeedback } from '@/hooks/use-transaction.hook'
import { type ServiceAsset } from '@/types/onchain.types'
import { abbreviateBigNumber, stringInputToBigNumber } from '@/utils/input.utils'

import serviceAbi from '../../service.abi.json'
import { prepareOrder } from '../../service.contract'

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

  isBalanceLoading,
  isButtonDisabled,
  isButtonLoading,
  isMaxDisabled,
  isApproved,
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 bg-primary-100 rounded-xl">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">Deposit</Text>
        <div className="flex flex-row items-end justify-end gap-2">
          {isBalanceLoading ? (
            <Loading />
          ) : (
            <>
              <Text textStyle="lg">{abbreviateBigNumber(balance, asset!.decimals)}</Text>
              <Text textStyle="lg">
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
    </div>
  )
}

interface ServiceDepositProps {
  asset: ServiceAsset
  serviceAddress: Address
}

export const ServiceDeposit: FC<ServiceDepositProps> = ({ asset, serviceAddress }) => {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const [inputAmount, setInputAmount] = useState<string>('0')
  const inputBigNumber = stringInputToBigNumber(inputAmount, asset.decimals)

  const { trackTransaction } = useTransactionFeedback()

  const { useAllowance, useApprove } = useToken(asset.tokenAddress)
  const { data: allowance, refetch: refetchAllowance } = useAllowance(address, serviceAddress)
  const {
    // data: approveData,
    // isLoading: isApproveLoading,
    writeAsync: approve,
  } = useApprove(serviceAddress, inputBigNumber)

  // const order = prepareOrder(asset.tokenAddress, inputBigNumber, 2)
  // const { config: openConfig } = usePrepareContractWrite({
  //   address: serviceAddress,
  //   abi: serviceAbi,
  //   functionName: 'open',
  //   args: [order],
  // })
  const serviceContract = useContract({ address: serviceAddress, abi: serviceAbi, signerOrProvider: signer })

  // const { config: depositConfig } = usePrepareDeposit(inputBigNumber)
  // const { data: depositData, isLoading: isDepositLoading, writeAsync: deposit } = useContractWrite(depositConfig)

  const isButtonDisabled = inputBigNumber.isZero()
  const isButtonLoading = false
  const isApproved = allowance?.gte(inputBigNumber) ?? false
  const isMaxDisabled = false

  const onInputChange = (amount: string) => {
    setInputAmount(amount)
  }
  const onActionClick = async () => {
    if (!isApproved) {
      const result = await approve?.()
      await trackTransaction(result, `Approve ${inputAmount} ${asset.name}`)
      await refetchAllowance()
    }
    const order = prepareOrder(asset.tokenAddress, inputBigNumber, 2)
    console.log({ order: JSON.parse(JSON.stringify(order)) })

    const unsignedTx = await serviceContract?.populateTransaction.open(order)
    console.log({ unsignedTx })
    const response = await serviceContract?.open(order)
    console.log({ response })
  }
  const onMaxClick = () => {}

  return (
    <WidgetSingleAssetDeposit
      inputAmount={inputAmount}
      onInputChange={onInputChange}
      onActionClick={onActionClick}
      onMaxClick={onMaxClick}
      isBalanceLoading={true}
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
        isBalanceLoading={true}
        isButtonDisabled={true}
        isButtonLoading={false}
        isMaxDisabled={false}
        isApproved={false}
      />
    ),
  },
)
