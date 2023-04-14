import { type BigNumber } from '@ethersproject/bignumber'
import { type Address } from 'wagmi'

// used in Lend page
export interface LendingToken {
  name: string
  coingeckoId: string
  iconName: string
  decimals: number
  tokenAddress: `0x${string}`
  vaultAddress: `0x${string}`
}
export type LendingTokenList = LendingToken[]
export type Vaults = Array<{
  key: string
  token: LendingTokenList[number]
  tvl?: BigNumber
  borrowed?: BigNumber
  deposited?: BigNumber
}>

export type AddressByEnvironment = Record<string, `0x${string}`>
export interface ServiceAsset {
  name: string
  coingeckoId: string
  iconName: string
  decimals: number
  tokenAddress: `0x${string}`
}
export type ServiceAssetHash = Record<Lowercase<string>, ServiceAsset>
export interface ServiceByEnvironment {
  name: string
  description: string
  address: AddressByEnvironment
  assets: ServiceAsset[]
}
// the hook should convert ServiceByEnvironment in Service
export interface Service extends Omit<ServiceByEnvironment, 'address' | 'assets'> {
  address: Address
  assets: ServiceAssetHash
}

export type ServicesByEnvironment = Record<string, ServiceByEnvironment>
export type Services = Record<Lowercase<string>, Service>
