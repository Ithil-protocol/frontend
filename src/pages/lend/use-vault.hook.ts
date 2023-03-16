import type { BigNumber } from '@ethersproject/bignumber'
import { LendingToken } from 'src/types/onchain.types'
import { Address, erc4626ABI, useBalance, usePrepareContractWrite } from 'wagmi'
import { useToken } from './use-token.hook'

export const useVault = (token: LendingToken, userAddress: Address | undefined) => {
  const { useAllowance } = useToken(token.tokenAddress)
  const { data: allowance } = useAllowance(
    userAddress,
    token.vaultAddress
  )
  const { data: sharesBalance } = useBalance({
    address: userAddress,
    token: token.vaultAddress,
    cacheTime: 5_000,
    watch: true,
  })

  const isApproved = (amount: BigNumber) => allowance?.gte(amount) ?? false

  const usePrepareDeposit = (amount: BigNumber) => {
    return usePrepareContractWrite({
      address: token.vaultAddress,
      abi: erc4626ABI,
      functionName: 'deposit',
      args: [amount, userAddress!],
      enabled: userAddress != null && isApproved(amount)
    })
  }

  const usePrepareWithdraw = (amount: BigNumber) => {
    return usePrepareContractWrite({
      address: token.vaultAddress,
      abi: erc4626ABI,
      functionName: 'withdraw',
      args: [amount, userAddress!, userAddress!],
      enabled: userAddress != null && sharesBalance?.value.gt(amount)
    })
  }

  return {
    usePrepareDeposit,
    usePrepareWithdraw,
  }
}
