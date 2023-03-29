import { type BigNumber } from '@ethersproject/bignumber'

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
