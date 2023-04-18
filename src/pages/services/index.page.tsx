import { Heading, Text, useColorMode } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { type GetStaticProps, type GetStaticPropsContext } from 'next'
import Head from 'next/head'
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

const ServiceCard: FC = () => {
  const { colorMode } = useColorMode()
  return (
    <div className="flex flex-col p-7 rounded-xl bg-primary-100">
      <div className="flex justify-between mb-6">
        <div>TokenComponent</div>
        {/* 1 - 10% multiplier */}
        <div className="flex items-center gap-1 px-2 py-1 border rounded-md border-primary-500">
          <Icon icon="ph:lightning-fill" color={colorMode === 'dark' ? 'white' : 'black'}></Icon>
          <Text textStyle="slender-sm">1 - 10%</Text>
        </div>
      </div>
      <Heading size="h3" className="mb-6">
        Service Name
      </Heading>
      <div className="flex py-3 mb-4 rounded-md bg-primary-600">
        <div className="flex items-center gap-2 mx-auto">
          <Text textStyle="slender-md">10 %</Text>
          <Text textStyle="md2">APY</Text>
        </div>
      </div>
      <Text className="mb-4">
        The vault deposits the user&apos; BNBx-BNB vLP in a Thena farm, earning the platform&apos;s governance token.
      </Text>
      <div className="flex gap-2 mb-4">
        <Text textStyle="sm" color="var(--primary-700);">
          TVL:
        </Text>
        <Text textStyle="slender-sm2">$ 12 M</Text>
      </div>
      {/* tokens array */}
      <div className="flex flex-wrap justify-around gap-2">
        {['usdc', 'dai', 'weth', 'wbtc', 'usdt'].map((token) => (
          <ServiceToken token={token} key={token} />
        ))}
      </div>
    </div>
  )
}

const ServicesGrid: FC = () => (
  <div className="grid gap-4 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
    <ServiceCard />
    <ServiceCard />
    <ServiceCard />
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
