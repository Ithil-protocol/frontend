import { useMemo } from 'react'

import { coreConfig } from '@/config/env'
import { type ServiceAssetHash, type Services, type ServicesByEnvironment } from '@/types/onchain.types'

import servicesJson from './services.json'

const servicesByEnv = servicesJson as ServicesByEnvironment

export const getServices = () => {
  const serviceNames = Object.keys(servicesByEnv).map((name) => name.toLowerCase()) as Array<Lowercase<string>>

  // Example result: { 'aave': { 'usdt': { name: 'usdt', address: '0x...'}, 'usdc': {...} } }
  const services = serviceNames.reduce<Services>((hash, name) => {
    const { address: _, assets, ...rest } = servicesByEnv[name]
    const address = servicesByEnv[name].address[coreConfig.instance]

    const assetsHash = assets.reduce<ServiceAssetHash>((assetHash, asset) => {
      assetHash[asset.name.toLowerCase() as Lowercase<string>] = asset
      return assetHash
    }, {})

    hash[name.toLowerCase() as Lowercase<string>] = { ...rest, address, assets: assetsHash }
    return hash
  }, {})

  return { names: serviceNames, services }
}

export const useServices = () => {
  return useMemo(() => getServices(), [])
}
