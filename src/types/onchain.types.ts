import { type BigNumber } from '@ethersproject/bignumber'
import { type Address } from 'wagmi'

// the minimal intersection of LendingToken and ServiceAsset
export interface MinimalToken {
  name: string
  coingeckoId: string
  iconName: string
  decimals: number
  tokenAddress: Address
}

// used in Lend page
export interface LendingToken {
  name: string
  coingeckoId: string
  iconName: string
  decimals: number
  tokenAddress: Address
  vaultAddress: Address
}
export type LendingTokenList = LendingToken[]
export type Vaults = Array<{
  key: string
  token: LendingTokenList[number]
  tvl?: BigNumber
  borrowed?: BigNumber
  deposited?: BigNumber
}>

// used in services page
export type AddressByEnvironment = Record<string, Address>
export interface ServiceAsset {
  name: string
  coingeckoId: string
  iconName: string
  decimals: number
  tokenAddress: Address
  aTokenAddress: Address
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
