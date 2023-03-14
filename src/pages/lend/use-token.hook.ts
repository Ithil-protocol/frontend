import { BigNumber } from '@ethersproject/bignumber'
import { Address, erc20ABI, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'

export const useToken = (tokenAddress: Address) => {
  const useAllowance = (userAddress: Address | undefined, spender: Address) => useContractRead({
    address: userAddress == null ? undefined : tokenAddress, // if user is not provided, don't read the contract
    abi: erc20ABI,
    functionName: 'allowance',
    args: [userAddress!, spender],
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
