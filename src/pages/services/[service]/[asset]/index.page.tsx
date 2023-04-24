import { type GetStaticPaths, type GetStaticProps, type GetStaticPropsContext } from 'next'
import Head from 'next/head'
import { type FC } from 'react'

import { MultiAssetsIcons } from '@/components/multi-assets-icon'
import PageWrapper from '@/components/page-wrapper'
import { type Service, type ServiceAsset } from '@/types/onchain.types'

import { getServices } from '../../use-services.hook'
import { DynamicServiceDeposit } from './single-asset-deposit'

interface Props {
  service: Service
  asset: ServiceAsset
}

const ServicePage: FC<Props> = ({ service, asset }) => {
  return (
    <>
      <Head>
        <title>Ithil - Services</title>
        <meta name="description" content="Official frontend for Ithil strategies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper>
        <div className="flex flex-row w-full gap-6">
          <div className="flex flex-col flex-grow gap-6">
            <div className="flex flex-row gap-4 p-5 rounded-xl bg-primary-100">
              <div className="flex flex-col">
                <MultiAssetsIcons assets={[asset.iconName]} />
                <div>goback</div>
              </div>
              <div className="flex flex-col">
                <div>Yearn Finance Strat</div>
                <div>Details about strat</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-primary-100">Graph here</div>

            <div className="p-5 rounded-xl bg-primary-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                  <div>Strategy</div>
                  <div>Address on explorer</div>
                </div>

                <div>Description very long, lorem ipsum & so on</div>

                <div className="p-5 rounded-xl bg-primary-200">
                  <div>APY Breakdown</div>
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row flex-grow gap-4">
                      <div>Total APY</div>
                      <div>22.42%</div>
                    </div>

                    <div className="flex flex-row justify-center flex-grow gap-4 border-l border-secondary-500">
                      <div>Vault APR</div>
                      <div>18.23%</div>
                    </div>

                    <div className="flex flex-row justify-center flex-grow gap-4 border-l border-secondary-500">
                      <div>Boost APR</div>
                      <div>10.21%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-primary-100"></div>
          </div>
          <div>
            <DynamicServiceDeposit asset={asset} serviceAddress={service.address} />
          </div>
        </div>
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
  console.log({ service, asset })
  if (asset == null) return { redirect: '/services', props: {} }

  return {
    props: {
      service,
      serviceName: serviceParam,
      asset,
    } as Props,
  }
}

export default ServicePage
