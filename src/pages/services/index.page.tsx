import { Button, Heading, Text, useColorMode } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { type GetStaticProps, type GetStaticPropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { format } from 'numerable'
import { type FC } from 'react'

import PageWrapper from '@/components/page-wrapper'
import { type Services } from '@/types/onchain.types'

import { getServices } from './use-services.hook'

const FilterAndSearchBar = () => (
  <div className="flex w-full gap-16 p-5 shadow rounded-xl bg-primary-100">
    <span className="block">Pretty Select Here</span>
    <span className="block">Search Bar Here</span>
  </div>
)

interface ServiceTokenProps {
  token: string
}

const ServiceToken: FC<ServiceTokenProps> = ({ token }) => (
  <div className="flex py-1 min-w-[92px] border border-primary-500 rounded-md">
    <Text textStyle="slender-sm" fontWeight="normal" className="mx-auto">
      {token.toUpperCase()}
    </Text>
  </div>
)

interface MultiAssetsIconsProps {
  assets: string[]
}

// supports maximum of 5 assets
const MultiAssetsIcons: FC<MultiAssetsIconsProps> = ({ assets }) => {
  // tailwind needs extractable classes to be in the same file
  const offsets = ['', 'right-2', 'right-4', 'right-6', 'right-8']
  const zIndexes = ['z-0', 'z-1', 'z-2', 'z-3', 'z-4']

  return (
    <div className="relative flex">
      {assets.map((asset, idx) => (
        <Image
          src={`/assets/tokens/${asset}.svg`}
          alt={`${asset} icon`}
          height={32}
          width={32}
          key={asset}
          className={classNames('relative', zIndexes[idx], offsets[idx], {
            'rounded-full ring-offset-2 ring-offset-primary-100 ring-2 ring-primary-100': idx > 0,
          })}
        />
      ))}
    </div>
  )
}

interface ServiceCardProps {
  assets: string[]
  serviceName: string
  apy: number
  tvl: number
  description: string | ((assets: string[]) => string)
}

const ServiceCard: FC<ServiceCardProps> = ({ assets, serviceName, apy, tvl, description }) => {
  const { colorMode } = useColorMode()
  return (
    <div className="flex flex-col p-7 rounded-xl bg-primary-100">
      <div className="flex justify-between mb-6">
        <MultiAssetsIcons assets={assets} />
        {/* 1 - 10% multiplier */}
        <div className="flex items-center gap-1 px-2 py-1 border rounded-md border-primary-500">
          <Icon icon="ph:lightning-fill" color={colorMode === 'dark' ? 'white' : 'black'}></Icon>
          <Text textStyle="slender-sm">1 - 10%</Text>
        </div>
      </div>
      <Heading size="h3" className="mb-6">
        {serviceName}
      </Heading>
      <div className="flex py-3 mb-4 rounded-md bg-primary-600">
        <div className="flex items-center gap-2 mx-auto">
          <Text textStyle="slender-md">{apy} %</Text>
          <Text textStyle="md2">APY</Text>
        </div>
      </div>
      <Text className="mb-4">{typeof description === 'string' ? description : description(assets)}</Text>
      <div className="flex gap-2 mb-4">
        <Text textStyle="sm" color="var(--primary-700);">
          TVL:
        </Text>
        <Text textStyle="slender-sm2">$ {format(tvl, '0.00 a')}</Text>
      </div>
      {/* tokens array */}
      <div className="flex flex-wrap gap-2 mb-6 justify-evenly">
        {assets.map((token) => (
          <ServiceToken token={token} key={token} />
        ))}
      </div>
      <Button size="lg" className="w-full">
        Enter
      </Button>
    </div>
  )
}

const ServicesGrid: FC = () => (
  <div className="grid gap-4 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
    <ServiceCard
      assets={['usdc', 'usdt', 'dai']}
      serviceName="AAVE"
      apy={19.2}
      tvl={10_000_000}
      description="The vault deposits the user' BNBx-BNB vLP in a Thena farm, earning the platform's governance token."
    />
    <ServiceCard
      assets={['usdc', 'usdt', 'dai']}
      serviceName="AAVE"
      apy={19.2}
      tvl={10_000_000}
      description="The vault deposits the user' BNBx-BNB vLP in a Thena farm, earning the platform's governance token."
    />
    <ServiceCard
      assets={['usdc', 'wbtc']}
      serviceName="AAVE"
      apy={19.2}
      tvl={10_000_000}
      description="The vault deposits the user' BNBx-BNB vLP in a Thena farm, earning the platform's governance token."
    />
  </div>
)

interface Props {
  services: Services
}

const ServicesPage: FC<Props> = ({ services }) => {
  return (
    <>
      <Head>
        <title>Ithil - Services</title>
        <meta name="description" content="Official frontend for Ithil strategies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper heading="Services" textAlign="left">
        <div className="flex flex-col w-full gap-6">
          <FilterAndSearchBar />
          <ServicesGrid />
        </div>
      </PageWrapper>
    </>
  )
}

export const getStaticProps: GetStaticProps = (context: GetStaticPropsContext) => {
  const { services } = getServices()
  return {
    props: {
      services,
    },
  }
}

export default ServicesPage
