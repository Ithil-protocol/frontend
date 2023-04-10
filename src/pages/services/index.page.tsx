import Head from 'next/head'
import { type FC } from 'react'

import PageWrapper from '@/components/page-wrapper'

import { DynamicServiceDeposit } from './single-asset-deposit'
import { useServices } from './use-services.hook'

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
        <DynamicServiceDeposit asset={services.AAVE.assets[0]} serviceAddress={services.AAVE.address} />
      </PageWrapper>
    </>
  )
}

export default Services
