import { type BigNumber } from "@ethersproject/bignumber";
import {
  type Address,
  erc4626ABI,
  useBalance,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";

import { useToken } from "@/hooks/use-token.hook";
import { type LendingToken } from "@/types/onchain.types";
import { oneUnitWithDecimals } from "@/utils/input.utils";

export const useVault = (
  token: LendingToken,
  userAddress: Address | undefined
) => {
  const { useAllowance } = useToken(token.tokenAddress);
  const { data: allowance } = useAllowance(userAddress, token.vaultAddress);
  const { data: sharesBalance } = useBalance({
    address: userAddress,
    token: token.vaultAddress,
    cacheTime: 5_000,
    watch: true,
  });

  const isApproved = (amount: bigint) => BigInt(allowance??0) > amount;

  const usePrepareDeposit = (amount: bigint) => {
    return usePrepareContractWrite({
      address: token.vaultAddress,
      abi: erc4626ABI,
      functionName: "deposit",
      args: [amount, userAddress!],
      enabled: userAddress != null && isApproved(amount),
    });
  };

  const usePrepareRedeem = (amount: bigint) => {
    return usePrepareContractWrite({
      address: token.vaultAddress,
      abi: erc4626ABI,
      functionName: "redeem",
      args: [amount, userAddress!, userAddress!],
      enabled: userAddress != null && sharesBalance && sharesBalance.value > amount,
    });
  };

  const useConvertToAssets = (amount = oneUnitWithDecimals(token.decimals)) => {
    return useContractRead({
      address: token.vaultAddress,
      abi: erc4626ABI,
      functionName: "convertToAssets",
      args: [amount],
      enabled: amount != null,
    });
  };

  const useConvertToShares = (amount = oneUnitWithDecimals(token.decimals)) => {
    return useContractRead({
      address: token.vaultAddress,
      abi: erc4626ABI,
      functionName: "convertToShares",
      args: [amount],
      enabled: amount != null,
    });
  };

  const useMaxRedeem = () => {
    return useContractRead({
      address: token.vaultAddress,
      abi: erc4626ABI,
      functionName: "maxRedeem",
      args: [userAddress!],
      enabled: userAddress != null,
      watch: true,
    });
  };

  return {
    usePrepareDeposit,
    usePrepareRedeem,
    useConvertToAssets,
    useConvertToShares,
    useMaxRedeem,
  };
};
