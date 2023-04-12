import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { type FC, useState } from 'react'
import { type Address, useAccount, useContract, useSigner } from 'wagmi'

import { useToken } from '@/hooks/use-token.hook'
import { useTransactionFeedback } from '@/hooks/use-transaction.hook'
import { type ServiceAsset } from '@/types/onchain.types'
import { stringInputToBigNumber } from '@/utils/input.utils'

import serviceAbi from './service.abi.json'
import { prepareOrder } from './service.contract'

interface WidgetSingleAssetDepositProps {
  inputAmount: string
  onInputChange: (amount: string) => void
  onActionClick: () => void
  onMaxClick: () => void
  isButtonDisabled: boolean
  isButtonLoading: boolean
  isMaxDisabled: boolean
  isApproved: boolean
  asset?: ServiceAsset
}

export const WidgetSingleAssetDeposit: FC<WidgetSingleAssetDepositProps> = ({
  inputAmount,
  onInputChange,
  onActionClick,
  onMaxClick,
  isButtonDisabled,
  isButtonLoading,
  isMaxDisabled,
  isApproved,
  asset,
}) => {
  return (
    <div>
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
    data: approveData,
    isLoading: isApproveLoading,
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
      isButtonDisabled={isButtonDisabled}
      isButtonLoading={isButtonLoading}
      isMaxDisabled={isMaxDisabled}
      isApproved={isApproved}
      asset={asset}
    />
  )
}

export const DynamicServiceDeposit = dynamic(
  async () => await import('@/pages/services/single-asset-deposit').then((mod) => mod.ServiceDeposit),
  {
    ssr: false,
    loading: () => (
      <WidgetSingleAssetDeposit
        inputAmount="0"
        onInputChange={() => {}}
        onActionClick={() => {}}
        onMaxClick={() => {}}
        isButtonDisabled={true}
        isButtonLoading={false}
        isMaxDisabled={false}
        isApproved={false}
      />
    ),
  },
)
