import { waitForTransaction } from "@wagmi/core";
import { FC, useRef, useState } from "react";
import { Address, formatUnits } from "viem";
import {
  erc20ABI,
  erc4626ABI,
  useAccount,
  useBalance,
  useContractWrite,
} from "wagmi";

import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { useToken } from "@/hooks/use-token.hook";
import { LendingToken } from "@/types/onchain.types";
import {
  bigNumberPercentage,
  stringInputToBigNumber,
} from "@/utils/input.utils";

import WidgetComponent from "./WidgetComponent";

interface LendingProps {
  token: LendingToken;
}

export const LendingDeposit: FC<LendingProps> = ({ token }) => {
  // state
  const notificationDialog = useNotificationDialog();

  const [inputAmount, setInputAmount] = useState<string>("0");
  const { address } = useAccount();
  const inputBigNumber = stringInputToBigNumber(inputAmount, token.decimals);

  // web3 hooks
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: token.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const { useAllowance } = useToken(token.tokenAddress);
  const inputValueRef = useRef("0");

  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    address,
    token.vaultAddress
  );

  const isApproved = (allowance ?? BigInt(0)) >= inputBigNumber;

  const {
    data: approveData,
    isLoading: isApproveLoading,
    write: approve,
  } = useContractWrite({
    address: token.tokenAddress as Address,
    abi: erc20ABI,
    functionName: "approve",
    onMutate: () => {
      notificationDialog.openLoading(`Approving ${inputAmount} ${token.name}`);
    },
    onSuccess: async ({ hash }) => {
      try {
        await waitForTransaction({
          hash,
        });
        notificationDialog.openSuccess(`Approved ${inputAmount} ${token.name}`);
        refetchAllowance();
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError(error),
  });

  const {
    data: depositData,
    isLoading: isDepositLoading,
    write: deposit,
  } = useContractWrite({
    address: token.vaultAddress as Address,
    abi: erc4626ABI,
    functionName: "deposit",
    onMutate: () => {
      notificationDialog.openLoading(`Depositing ${inputAmount} ${token.name}`);
    },
    onSuccess: async ({ hash }) => {
      try {
        await waitForTransaction({
          hash,
        });
        notificationDialog.openSuccess(
          `Deposited ${inputAmount} ${token.name}`
        );
        setInputAmount("0");
        refetchAllowance();
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError(error),
  });

  // computed properties
  const isButtonLoading = isApproveLoading || isDepositLoading;
  const isInconsistent = balance ? inputBigNumber > balance.value : true;
  const isButtonDisabled =
    isButtonLoading || isInconsistent || inputBigNumber === BigInt(0);
  const isMaxDisabled = balance
    ? inputBigNumber === balance.value || balance.value === BigInt(0)
    : false;

  // handlers
  const handleMaxClick = () => {
    setInputAmount(balance?.formatted ?? "0");
  };

  const handleClick = async () => {
    try {
      if (!isApproved) {
        approve({
          args: [token.vaultAddress, inputBigNumber],
        });
        return;
      }
      deposit({
        args: [inputBigNumber, address!],
      });
    } catch (error) {
      notificationDialog.openError(error);
    }
  };

  return (
    <WidgetComponent
      title="Deposit"
      balance={balance?.value ?? BigInt(0)}
      token={token}
      inputAmount={inputAmount}
      onInputChange={setInputAmount}
      onMaxClick={handleMaxClick}
      onPercentageClick={(percentage) =>
        setInputAmount(
          formatUnits(
            bigNumberPercentage(balance?.value, percentage),
            token.decimals
          )
        )
      }
      onActionClick={handleClick}
      isBalanceLoading={isBalanceLoading}
      isMaxDisabled={isMaxDisabled}
      isButtonDisabled={isButtonDisabled}
      isButtonLoading={isButtonLoading}
      isApproved={isApproved}
    />
  );
};

export default LendingDeposit;
