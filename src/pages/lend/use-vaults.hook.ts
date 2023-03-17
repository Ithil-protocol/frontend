import { BigNumber } from '@ethersproject/bignumber'
import { useQuery } from '@tanstack/react-query'
import { erc4626ABI, multicall } from '@wagmi/core'
import { useAccount } from 'wagmi'

import { ErrorCause } from 'src/state/error-cause'
import { Vaults } from 'src/types/onchain.types'

import { abbreviateBigNumber } from './input.util'
import { lendingTokens } from './use-token-data.hook'

const ithil4626customAbi = [
  {
    type: 'function',
    name: 'freeLiquidity',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

const VaultAbi = [...erc4626ABI, ...ithil4626customAbi]

export const placeHolderVaultData = lendingTokens.map((token) => ({
  key: token.name,
  token,
}))

const getVaultData = async (address?: string) => {
  const totalAssetsCalls = lendingTokens.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: 'totalAssets',
  }))
  const freeLiquidityCalls = lendingTokens.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: 'freeLiquidity',
  }))

  const balanceOfCalls =
    address != null
      ? lendingTokens.map((token) => ({
          address: token.vaultAddress,
          abi: VaultAbi,
          functionName: 'balanceOf',
          args: [address],
        }))
      : []

  const multicallData = await multicall({
    contracts: [...totalAssetsCalls, ...freeLiquidityCalls, ...balanceOfCalls],
  })

  if (multicallData.some((data) => data == null)) {
    throw new Error('Error fetching vault data', {
      cause: new ErrorCause('In localhost a wallet has to be connected for the UI to function'),
    })
  }

  const data: Vaults = placeHolderVaultData.map((vault, idx, arr) => {
    // tvl informations are available at index 0...length
    const tvl = multicallData[idx] as BigNumber
    // freeLiquidity informations are available at index length...length*2
    const freeLiquidity = multicallData[arr.length + idx] as BigNumber
    const borrowed = tvl.sub(freeLiquidity)
    // deposited informations are available at index length*2...length*3
    const deposited = address != null ? (multicallData[arr.length * 2 + idx] as BigNumber) : BigNumber.from(0)
    return {
      key: vault.key,
      token: vault.token,
      tvl: abbreviateBigNumber(tvl, vault.token.decimals),
      borrowed: abbreviateBigNumber(borrowed, vault.token.decimals),
      deposited: abbreviateBigNumber(deposited, vault.token.decimals),
    }
  })
  return data
}

export const useVaults = () => {
  const { address } = useAccount()

  return useQuery({
    queryKey: ['vaults', address],
    queryFn: async () => await getVaultData(address),
    placeholderData: placeHolderVaultData,
    keepPreviousData: true,

    retry: (failureCount, error: Error): boolean => {
      // avoid retrying if the error is handled
      if (ErrorCause.isErrorCause(error.cause)) return false
      return true
    },

    // FIXME: handle errors with chakra-ui/toast
    // onError: (error: Error) => {}
  })
}
