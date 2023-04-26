import { Heading, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { type GetStaticPaths, type GetStaticProps, type GetStaticPropsContext } from 'next'
import Head from 'next/head'
import { type FC } from 'react'
import { type Address, useNetwork } from 'wagmi'

import { MultiAssetsIcons } from '@/components/multi-assets-icon'
import PageWrapper from '@/components/page-wrapper'
import { type PropsWithClassName } from '@/types/components.types'
import { type Service, type ServiceAsset } from '@/types/onchain.types'
import { fakeApy } from '@/utils/fake-data.utils'
import { aprToApy } from '@/utils/math.utils'

import { getServices } from '../../use-services.hook'
import { DynamicServiceDeposit } from './single-asset-deposit'

interface StrategyDescriptionProps extends PropsWithClassName {
  description: string
  address: Address
  totalApy: number
  vaultApr: number
  boostApr: number
}

const StrategyDescription: FC<StrategyDescriptionProps> = ({
  description,
  address,
  totalApy,
  vaultApr,
  boostApr,
  className,
}) => {
  const { chain } = useNetwork()
  const explorerBaseUrl = chain?.blockExplorers?.default.url
  const containerClasses = 'p-5 rounded-xl bg-primary-100'

  return (
    <div className={classNames(containerClasses, className)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <Heading size="h3">Strategy</Heading>
          {explorerBaseUrl != null && (
            <a
              href={`${explorerBaseUrl}/address/${address}`}
              target="_blank"
              className="flex flex-row items-center gap-2"
            >
              <Icon icon="mdi:link" width="20px" height="20px" color="var(--primary-action)"></Icon>
              <Heading size="h2">Address on explorer</Heading>
            </a>
          )}
        </div>

        <Text textStyle="sm">{description}</Text>

        <div className="flex flex-col gap-2 p-5 rounded-xl bg-primary-200">
          <Heading size="h4">APY Breakdown</Heading>
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row items-center flex-grow gap-4">
              <Heading size="h5" color="var(--primary-800)" textTransform="uppercase">
                Total APY
              </Heading>
              <Text textStyle="slender-sm2">{totalApy.toFixed(2)} %</Text>
            </div>

            <div className="flex flex-row items-center justify-center flex-grow gap-4 border-l border-secondary-500">
              <Heading size="h5" color="var(--primary-800)" textTransform="uppercase">
                Vault APR
              </Heading>
              <Text textStyle="slender-sm2">{vaultApr.toFixed(2)} %</Text>
            </div>

            <div className="flex flex-row items-center justify-center flex-grow gap-4 border-l border-secondary-500">
              <Heading size="h5" color="var(--primary-800)" textTransform="uppercase">
                Boost APR
              </Heading>
              <Text textStyle="slender-sm2">{boostApr.toFixed(2)} %</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  service: Service
  asset: ServiceAsset
}

const ServicePage: FC<Props> = ({ service, asset }) => {
  const vaultApr = fakeApy([service.name, asset.iconName, 'vault'])
  const boostApr = fakeApy([service.name, asset.iconName, 'boost'], 1)
  const totalApy = aprToApy(vaultApr + boostApr)
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

            <StrategyDescription
              description="Description very long, lorem ipsum & so on"
              address={service.address}
              totalApy={totalApy}
              vaultApr={vaultApr}
              boostApr={boostApr}
            />
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
