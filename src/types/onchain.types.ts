// used in Lend page
export interface LendingToken {
  name: string
  iconName: string
  decimals: number
  tokenAddress: `0x${string}`
  vaultAddress: `0x${string}`
}
export type LendingTokenList = LendingToken[];
export type Vaults = Array<{
  key: string
  token: LendingTokenList[number]
  tvl?: string
  borrowed?: string
  deposited?: string
}>
