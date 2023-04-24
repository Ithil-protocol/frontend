import { Button, Heading, Select, Text, useColorMode } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { type GetStaticProps, type GetStaticPropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { format } from 'numerable'
import { type FC, useMemo, useState } from 'react'

import { MultiAssetsIcons } from '@/components/multi-assets-icon'
import PageWrapper from '@/components/page-wrapper'
import { type Services } from '@/types/onchain.types'

import { getServices, useServices } from './use-services.hook'

interface FilterAndSearchBarProps {
  selectedId?: string
  onChange: (id: Lowercase<string>) => void
}

const FilterAndSearchBar: FC<FilterAndSearchBarProps> = ({ selectedId, onChange }) => {
  const { servicesList } = useServices()
  return (
    <div className="flex w-full gap-16 p-5 shadow md:w-1/2 rounded-xl bg-primary-100">
      <Select
        placeholder={selectedId !== '' ? 'All' : 'Filter by protocol'}
        value={selectedId}
        onChange={(event) => onChange(event.target.value as Lowercase<string>)}
      >
        {servicesList.map(({ name, id }) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      </Select>
    </div>
  )
}

const ServiceToken: FC<{ token: string }> = ({ token }) => (
  <div className="flex py-1 min-w-[92px] border border-primary-500 rounded-md">
    <Text textStyle="slender-sm" fontWeight="normal" className="mx-auto">
      {token.toUpperCase()}
    </Text>
  </div>
)

interface ServiceCardProps {
  assets: string[]
  assetsId: Lowercase<string>
  serviceName: string
  serviceId: Lowercase<string>
  apy: number
  tvl: number
  description: string | ((assets: string[]) => string)
}

const ServiceCard: FC<ServiceCardProps> = ({ assets, assetsId, serviceName, serviceId, apy, tvl, description }) => {
  const { colorMode } = useColorMode()
  return (
    <Link href={`/services/${serviceId}/${assetsId}`} className="flex flex-col p-7 rounded-xl bg-primary-100">
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
    </Link>
  )
}

const ServicesGrid: FC<{ services: Services }> = ({ services }) => {
  const cards: Array<{
    assets: string[]
    assetsId: Lowercase<string>
    serviceName: string
    serviceId: Lowercase<string>
    apy: number
    tvl: number
    description: string
  }> = []
  Object.keys(services).forEach((id) => {
    const { assets, description, name: serviceName } = services[id as Lowercase<string>]
    const serviceId = id as Lowercase<string>
    Object.keys(assets).forEach((asset) => {
      // assets and assetsId will be reworked a little bit when including services with multiple tokens
      const iconName = assets[asset as Lowercase<string>].iconName
      const assetsId = asset as Lowercase<string>
      const fakeApy = Math.ceil(Math.random() * 1000) / 10 // 0.1 - 100%
      const fakeTvl = Math.ceil(Math.random() * 1000) * 10000 // 0.1 - 10M
      cards.push({ assets: [iconName], assetsId, serviceName, serviceId, apy: fakeApy, tvl: fakeTvl, description })
    })
  })

  return (
    <div className="grid gap-4 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
      {cards.map(({ assets, assetsId, serviceName, serviceId, apy, tvl, description }) => (
        <ServiceCard
          key={`${serviceName}-${assetsId}`}
          assets={assets}
          assetsId={assetsId}
          serviceName={serviceName}
          serviceId={serviceId}
          apy={apy}
          tvl={tvl}
          description={description}
        />
      ))}
    </div>
  )
}

interface Props {
  services: Services
}

const ServicesPage: FC<Props> = ({ services }) => {
  const [filteredService, setFilteredService] = useState<Lowercase<string>>('')

  const filteredServices: Services = useMemo(() => {
    if (filteredService === '') return services
    const whitelistService = services[filteredService]
    return { [filteredService]: whitelistService }
  }, [services, filteredService])

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
          <FilterAndSearchBar onChange={setFilteredService} selectedId={filteredService} />
          <ServicesGrid services={filteredServices} />
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
