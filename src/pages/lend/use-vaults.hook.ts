import { TokenList } from 'src/types/onchain.types'

const tokens: TokenList = [
  {
    name: 'USDC',
    iconName: 'usdc',
  },
  {
    name: 'USDT',
    iconName: 'usdt',
  },
  {
    name: 'DAI',
    iconName: 'dai',
  },
  {
    name: 'WETH',
    iconName: 'eth',
  },
  {
    name: 'WBTC',
    iconName: 'btc',
  }
]

export type Vaults = Array<{
  key: string
  token: TokenList[number]
}>

export const useVaults = () => {

  const vaults: Vaults = tokens.map(token => ({
    key: token.name,
    token,
  }))

  return { vaults }
}
