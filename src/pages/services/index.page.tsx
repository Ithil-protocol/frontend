import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import Head from 'next/head'
import { type FC, useState } from 'react'
import { type Address } from 'wagmi'

import PageWrapper from '@/components/page-wrapper'
import { useToken } from '@/hooks/use-token.hook'
import { useTransactionFeedback } from '@/hooks/use-transaction.hook'
import { type ServiceAsset } from '@/types/onchain.types'
import { stringInputToBigNumber } from '@/utils/input.utils'

import { useServices } from './use-services.hook'

interface ServiceDepositProps {
  asset: ServiceAsset
  serviceAddress: Address
}

const ServiceDeposit: FC<ServiceDepositProps> = ({ asset, serviceAddress }) => {
  const [inputAmount, setInputAmount] = useState<string>('0')
  const inputBigNumber = stringInputToBigNumber(inputAmount, asset.decimals)

  const { useAllowance, useApprove } = useToken(asset.tokenAddress)
  const { data: allowance, refetch: refetchAllowance } = useAllowance(asset.tokenAddress, serviceAddress)
  const {
    data: approveData,
    isLoading: isApproveLoading,
    writeAsync: approve,
  } = useApprove(serviceAddress, inputBigNumber)
  const { trackTransaction } = useTransactionFeedback()

  const isButtonDisabled = false
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
  }
  const onMaxClick = () => {}

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
        {isApproved ? `Deposit ${asset.name}` : `Approve ${asset.name}`}
      </Button>
    </div>
  )
}

const Services: FC = () => {
  const { names, services, assetsByService } = useServices()
  const assetsAvailable = assetsByService[names[0]]

  return (
    <>
      <Head>
        <title>Ithil - Services</title>
        <meta name="description" content="Official frontend for Ithil strategies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper heading="Services">
        <div>
          {assetsAvailable.map((asset) => (
            <p key={asset}>{asset}</p>
          ))}
        </div>
        <ServiceDeposit asset={services.AAVE.assets[0]} serviceAddress={services.AAVE.address} />
      </PageWrapper>
    </>
  )
}

export default Services
