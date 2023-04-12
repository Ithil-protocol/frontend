import { type BigNumber } from '@ethersproject/bignumber'
import { type Address, erc20ABI, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'

export const useToken = (tokenAddress: Address) => {
  const useAllowance = (userAddress: Address | undefined, spender: Address) =>
    useContractRead({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [userAddress!, spender],
      enabled: userAddress != null,
    })

  const useApprove = (spender: Address, amount: BigNumber) => {
    const { config } = usePrepareContractWrite({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
      args: [spender, amount],
    })

    return useContractWrite(config)
  }

  return {
    useAllowance,
    useApprove,
  }
}
