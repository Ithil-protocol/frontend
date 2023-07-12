import { useToast } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Address, formatUnits } from "viem";
import {
  erc20ABI,
  erc4626ABI,
  useAccount,
  useBalance,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { useToken } from "@/hooks/use-token.hook";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { useVault } from "@/hooks/use-vault.hook";
import { useTransaction } from "@/hooks/useTransaction";
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
  const [inputAmount, setInputAmount] = useState<string>("0");
  const { address } = useAccount();
  const inputBigNumber = stringInputToBigNumber(inputAmount, token.decimals);

  const toast = useToast();

  // web3 hooks
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: token.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const { useAllowance, useApprove } = useToken(token.tokenAddress);
  const { usePrepareDeposit } = useVault(token, address);
  const { trackTransaction } = useTransactionFeedback();

  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    address,
    token.vaultAddress
  );

  const isApproved = (allowance ?? BigInt(0)) >= inputBigNumber;

  console.log("allowance33", allowance);

  // const {
  //   data: approveData,
  //   isLoading: isApproveLoading,
  //   writeAsync: approve,
  // } = useApprove(token.vaultAddress, inputBigNumber);

  const {
    data: approveData,
    isLoading: isApproveLoading,
    writeAsync: approve,
  } = useContractWrite({
    address: token.tokenAddress as Address,
    abi: erc20ABI,
    functionName: "approve",
  });

  const { isLoading: isApproveWaiting } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  // deposit
  // const { config: depositConfig, isFetching: isDepositFetching } =
  //   usePrepareDeposit(inputBigNumber);

  const {
    data: depositData,
    isLoading: isDepositLoading,
    writeAsync: deposit,
  } = useContractWrite({
    address: token.vaultAddress as Address,
    abi: erc4626ABI,
    functionName: "deposit",
  });
  const { isLoading: isDepositWaiting } = useWaitForTransaction({
    hash: depositData?.hash,
  });

  // computed properties
  const isButtonLoading =
    isApproveLoading ||
    isApproveWaiting ||
    isDepositLoading ||
    isDepositWaiting;
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
  const transaction = useTransaction(
    depositData?.hash as Address,
    `${isApproved ? "Deposit" : "Approve"} ${inputAmount} ${token.name}`
  );

  const handleClick = async () => {
    try {
      if (!isApproved) {
        // after approval is successful, read again the allowance
        const result = await approve({
          args: [token.vaultAddress, inputBigNumber],
        });
        // await trackTransaction(result, `Approve ${inputAmount} ${token.name}`);
        await refetchAllowance();
        return;
      }
      // if (!deposit) return;
      const result = await deposit({
        args: [inputBigNumber, address!],
      });
      // await trackTransaction(result, `Deposit ${inputAmount} ${token.name}`);
      await refetchAllowance();
      setInputAmount("0");
    } catch (error) {
      toast({
        title: (error as { shortMessage: string }).shortMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
