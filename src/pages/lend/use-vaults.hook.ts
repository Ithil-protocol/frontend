import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useQuery } from '@tanstack/react-query'
import { erc4626ABI, multicall } from '@wagmi/core'
import numeral from 'numeral'

import lendingTokens from 'src/pages/lend/lend.tokens.json'
import { ErrorCause } from 'src/state/error-cause'
import { LendingTokenList, Vaults } from 'src/types/onchain.types'
import { useAccount } from 'wagmi'

const ithil4626customAbi = [{
  type: 'function',
  name: 'freeLiquidity',
  constant: true,
  stateMutability: 'view',
  payable: false,
  inputs: [],
  outputs: [{ type: 'uint256' }]
}] as const

const VaultAbi = [...erc4626ABI, ...ithil4626customAbi]

const tokens = lendingTokens as LendingTokenList
export const placeHolderVaultData = tokens.map(token => ({
  key: token.name,
  token,
}))

// FIXME: support connected wallet or not
const getVaultData = async (address?: string) => {
  const totalAssetsCalls = tokens.map(token => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: 'totalAssets',
  }))
  const freeLiquidityCalls = tokens.map(token => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: 'freeLiquidity',
  }))

  const balanceOfCalls = address != null ? tokens.map(token => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: 'balanceOf',
    args: [address],
  })): []

  const multicallData = await multicall({
    contracts: [...totalAssetsCalls, ...freeLiquidityCalls, ...balanceOfCalls]
  })

  if (multicallData.some(data => data == null)) {
    throw new Error('Error fetching vault data', {
      cause: new ErrorCause('In localhost a wallet has to be connected for the UI to function')
    })
  }

  const data: Vaults = placeHolderVaultData.map((vault, idx, arr) => {
    // tvl informations are available at index 0...length
    const tvl = multicallData[idx] as BigNumber
    // freeLiquidity informations are available at index length...length*2
    const freeLiquidity = multicallData[arr.length + idx] as BigNumber
    const borrowed = tvl.sub(freeLiquidity)
    // deposited informations are available at index length*2...length*3
    const deposited = address != null ? multicallData[arr.length * 2 + idx] as BigNumber : BigNumber.from(0)
    return {
      key: vault.key,
      token: vault.token,
      tvl: numeral(formatUnits(tvl, vault.token.decimals)).format('0.00a'),
      borrowed: numeral(formatUnits(borrowed, vault.token.decimals)).format('0.00a'),
      deposited: numeral(formatUnits(deposited, vault.token.decimals)).format('0.00a'),
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

    retry: (failureCount, error: Error): boolean => { // avoid retrying if the error is handled
      if (ErrorCause.isErrorCause(error.cause)) return false
      return true
    },

    // FIXME: handle errors with chakra-ui/toast
    // onError: (error: Error) => {}
  })
}
