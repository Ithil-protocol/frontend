import { coreConfig } from '@/config/env'
import { type Services, type ServicesByEnvironment } from '@/types/onchain.types'

import servicesJson from './services.json'

const servicesByEnv = servicesJson as ServicesByEnvironment

export const useServices = () => {
  const serviceNames = Object.keys(servicesByEnv)
  const assetsByService = serviceNames.reduce<Record<string, string[]>>((acc, name) => {
    const assets = servicesByEnv[name].assets.map((asset) => asset.name)
    return { ...acc, [name]: assets }
  }, {})

  const services = serviceNames.reduce<Services>((hash, name) => {
    const { address: _, ...rest } = servicesByEnv[name]
    const address = servicesByEnv[name].address[coreConfig.instance]

    hash[name] = { ...rest, address }
    return hash
  }, {})

  return { names: serviceNames, services, assetsByService }
}
