import { waitForTransaction } from "@wagmi/core";
import { useState } from "react";
import { Address, formatUnits } from "viem";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";

import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { AssetEssential } from "@/types";

import {
  usePrepareTokenApprove,
  useTokenAllowance,
  useTokenApprove,
} from "./generated/token";

interface AllowanceProps {
  amount: string | undefined;
  spender: Address;
  token: AssetEssential;
}
export const useAllowance = ({
  amount = "0",
  spender,
  token,
}: AllowanceProps) => {
  const [isAllowanceRefetching, setIsAllowanceRefetching] = useState(false);

  const notificationDialog = useNotificationDialog();
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
    args: [spender, parseUnits(amount, token.decimals)],
    enabled: needAllowance,
    cacheTime: 0,
  });

  const mutation = useTokenApprove({
    ...config,
    onMutate: ({ args }) => {
      notificationDialog.openLoading("Approving");
    },
    onSuccess: async ({ hash }) => {
      try {
        await waitForTransaction({
          hash,
        });
        notificationDialog.openSuccess(`Approved ${token.name}`);
        setIsAllowanceRefetching(true);
        await refetchAllowance();
        setIsAllowanceRefetching(false);
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError(error),
  });

  return {
    ...mutation,
    isApproved: !needAllowance,
    isAllowanceRefetching,
  };
};
