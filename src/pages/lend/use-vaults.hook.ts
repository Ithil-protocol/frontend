import { TokenList } from 'src/types/onchain.types'
import { multicall , erc4626ABI } from '@wagmi/core'
import { useQuery } from '@tanstack/react-query'
import type { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import numeral from 'numeral'

const ithil4626customAbi = [{
  type: 'function',
  name: 'freeLiquidity',
  constant: true,
  stateMutability: 'view',
  payable: false,
  inputs: [],
  outputs: [
    {
      type: 'uint256'
    }
  ]
}] as const

const VaultAbi = [...erc4626ABI, ...ithil4626customAbi]

const tokens: TokenList = [
  {
    name: 'USDC',
    iconName: 'usdc',
    decimals: 6,
  },
  {
    name: 'USDT',
    iconName: 'usdt',
    decimals: 6,
  },
  {
    name: 'DAI',
    iconName: 'dai',
    decimals: 18,
  },
  {
    name: 'WETH',
    iconName: 'eth',
    decimals: 18,
  },
  {
    name: 'WBTC',
    iconName: 'btc',
    decimals: 8,
  }
]

export type Vaults = Array<{
  key: string
  token: TokenList[number]
  tvl?: string
  borrowed?: string
}>

const placeHolderVaultData = [tokens[0], tokens[1]].map(token => ({
  key: token.name,
  token,
}))

// FIXME: support connected wallet or not
const getVaultData = async () => {
  const multicallData = await multicall({
    contracts: [
      {
        address: '0xd43757C1ce83AfE6a71B2DF5086C2c9BBEBA86a2',
        abi: VaultAbi,
        functionName: 'totalAssets',
      },
      {
        address: '0x5ebB6f5DdEB85358A4d93BFfA257A81cA7c22785',
        abi: VaultAbi,
        functionName: 'totalAssets',
      },
      // freeLiquidity
      {
        address: '0xd43757C1ce83AfE6a71B2DF5086C2c9BBEBA86a2',
        abi: VaultAbi,
        functionName: 'freeLiquidity',
      },
      {
        address: '0x5ebB6f5DdEB85358A4d93BFfA257A81cA7c22785',
        abi: VaultAbi,
        functionName: 'freeLiquidity',
      },
    ]
  })

  console.log({
    multicallData,
  })

  const data = placeHolderVaultData.map((vault, idx, arr) => {
    // tvl informations are available at index 0...length
    const tvl = multicallData[idx] as BigNumber
    // freeLiquidity informations are available at index length...length*2
    const freeLiquidity = multicallData[arr.length + idx] as BigNumber
    const borrowed = tvl.sub(freeLiquidity)
    return {
      key: vault.key,
      token: vault.token,
      tvl: numeral(formatUnits(tvl, vault.token.decimals)).format('0.00 a'),
      borrowed: numeral(formatUnits(borrowed, vault.token.decimals)).format('0.00 a'),
    }
  })
  return data
}

export const useVaults = () => {
  return useQuery({ queryKey: ['vaults'], queryFn: getVaultData, placeholderData: placeHolderVaultData })
}
