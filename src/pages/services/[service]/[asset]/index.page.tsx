import { type GetStaticPaths, type GetStaticProps, type GetStaticPropsContext } from 'next'
import Head from 'next/head'
import { type FC } from 'react'

import PageWrapper from '@/components/page-wrapper'
import { type ServiceAsset } from '@/types/onchain.types'

import { getServices, useServices } from '../../use-services.hook'
import { DynamicServiceDeposit } from './single-asset-deposit'

interface Props {
  serviceName: Lowercase<string>
  asset: ServiceAsset
}

const Services: FC<Props> = ({ serviceName, asset }) => {
  const { services } = useServices()
  const assetsAvailable = Object.keys(services.aave.assets)

  const service = services[serviceName]
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
        <DynamicServiceDeposit asset={asset} serviceAddress={service.address} />
      </PageWrapper>
    </>
  )
}

interface Params extends NodeJS.Dict<string> {
  service: string
  asset: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const { names, services } = getServices()
  // Generate all possible paths for the dynamic route
  const paths = names.flatMap((serviceName) => {
    const assets = Object.keys(services[serviceName].assets) as Array<Lowercase<string>>
    return assets.map((asset) => ({ params: { service: serviceName, asset } }))
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = (context: GetStaticPropsContext) => {
  const { names, services } = getServices()
  if (context.params == null) return { redirect: '/services', props: {} }
  if (typeof context.params?.service !== 'string' || typeof context.params?.asset !== 'string')
    return { redirect: '/services', props: {} }
  const serviceParam = context.params.service.toLowerCase() as Lowercase<string>
  const assetParam = context.params.asset.toLowerCase() as Lowercase<string>
  if (!names.includes(serviceParam)) return { redirect: '/services', props: {} }
  // param validation done

  const service = services[serviceParam]
  const asset = service.assets[assetParam]
  if (asset == null) return { redirect: '/services', props: {} }

  return {
    props: {
      serviceName: serviceParam,
      asset,
    } as Props,
  }
}

export default Services
