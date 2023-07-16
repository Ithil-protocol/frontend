import { useLayoutEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";

import { Token } from "@/types/onchain.types";
import { MAX_UINT256 } from "@/utils/constants";

import {
  usePrepareTokenApprove,
  useTokenAllowance,
  useTokenApprove,
} from "./generated/token";

interface AllowanceProps {
  amount: string | undefined;
  spender: Address;
  token: Token;
}
export const useAllowance = ({
  amount = "0",
  spender,
  token,
}: AllowanceProps) => {
  const [isApproved, setIsApproved] = useState(false);
  const { address } = useAccount();
  const { data: allowanceValue, refetch: refetchAllowance } = useTokenAllowance(
    {
      address: token.tokenAddress,
      args: [address as Address, spender],
      enabled: !!address,
      watch: true,
    }
  );

  const currentAllowance = allowanceValue
    ? Number(formatUnits(allowanceValue, token.decimals))
    : 0;

  const needAllowance = currentAllowance < Number(amount);

  const { config } = usePrepareTokenApprove({
    address: token.tokenAddress,
    args: [spender, MAX_UINT256],
    enabled: needAllowance,
    cacheTime: 0,
  });

  const {
    writeAsync,
    data: writeData,
    isLoading: writeLoading,
  } = useTokenApprove({
    ...config,
  });

  const { isLoading: waitLoading, isSuccess } = useWaitForTransaction({
    hash: writeData?.hash,
  });
  useLayoutEffect(() => {
    if (isSuccess) {
      refetchAllowance();
    }
    if (needAllowance) {
      setIsApproved(false);
    } else {
      setIsApproved(true);
    }
  }, [needAllowance, isSuccess, refetchAllowance]);

  return {
    writeAsync,
    isApproved,
    isLoading: writeLoading || waitLoading,
  };
};
