import { FC, useRef, useState } from "react";
import { formatUnits } from "viem";
import { erc4626ABI, useAccount, useBalance, useContractWrite } from "wagmi";

import { useVault } from "@/hooks/use-vault.hook";
import { useNotificationDialog } from "@/hooks/useNotificationDialog";
import { useTransaction } from "@/hooks/useTransaction";
import { Address } from "@/types";
import { LendingToken } from "@/types/onchain.types";
import {
  bigNumberPercentage,
  multiplyBigNumbers,
  stringInputToBigNumber,
} from "@/utils/input.utils";

import WidgetComponent from "./WidgetComponent";

interface LendingProps {
  token: LendingToken;
}
export const LendingWithdraw: FC<LendingProps> = ({ token }) => {
  // state
  const inputValueRef = useRef("0");

  const [inputAmount, setInputAmount] = useState<string>("0");
  // in Withdraw, this represents Shares, not Assets
  const [inputBigNumber, setInputBigNumber] = useState<bigint>(BigInt(0));
  const { address } = useAccount();
  const notificationDialog = useNotificationDialog();

  // web3 hooks
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: token.vaultAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const { useMaxRedeem, useConvertToAssets, useConvertToShares } = useVault(
    token,
    address
  );

  // withdraw
  // const {
  //   config: redeemConfig,
  //   isError: isPrRedeemError,
  //   isFetching: isWithdrawFetching,
  // } = usePrepareRedeem(inputBigNumber);

  const {
    data: withdrawData,
    isLoading: isWithdrawLoading,
    writeAsync: withdraw,
  } = useContractWrite({
    address: token.vaultAddress,
    abi: erc4626ABI,
    functionName: "redeem",
  });
  const { data: assetsRatioData, isLoading: isAssetsRatioLoading } =
    useConvertToAssets();
  const { data: sharesRatioData, isLoading: isSharesRatioLoading } =
    useConvertToShares();
  const { data: maxRedeemData, isLoading: isMaxRedeemLoading } = useMaxRedeem();

  // computed properties
  const assetsBalance = multiplyBigNumbers(
    balance?.value,
    assetsRatioData,
    token.decimals
  );
  const isButtonLoading = isWithdrawLoading || isMaxRedeemLoading;
  const isRequiredInfoLoading = isAssetsRatioLoading || isSharesRatioLoading;
  // const isPrepareError = isPrRedeemError;
  const isInconsistent = balance ? inputBigNumber > balance.value : true;
  const isButtonDisabled =
    isRequiredInfoLoading ||
    isButtonLoading ||
    isInconsistent ||
    inputBigNumber === BigInt(0);

  const isMaxDisabled = balance
    ? inputBigNumber === balance.value || balance.value === BigInt(0)
    : false;

  /**
   * withdraw logic
   * inputBigNumber will contain the amount of Shares to withdraw.
   * if the user clicks Max or 100%, set the inputAmount to the balance
   * otherwise, convert the string input via convertToShares
   */

  // handlers
  const handleMaxClick = () => {
    setInputAmount(formatUnits(assetsBalance, token.decimals));
    // in case the user is the last one in the pool, maxRedeem will be slightly less than its balance
    // in that case, use the maxRedeem value or the tx will fail
    const maxRedeem =
      maxRedeemData != null && balance != null && balance.value > maxRedeemData
        ? maxRedeemData
        : balance?.value;
    setInputBigNumber(maxRedeem ?? BigInt(0));
  };

  useTransaction(
    withdrawData?.hash as Address,
    `Withdraw ${inputValueRef.current} ${token.name}`
  );

  const handleClick = async () => {
    inputValueRef.current = inputAmount;

    try {
      await withdraw({
        args: [inputBigNumber, address!, address!],
      });
      // await trackTransaction(result, `Withdraw ${inputAmount} ${token.name}`);
      inputValueRef.current = inputAmount;
      setInputAmount("0");
      setInputBigNumber(BigInt(0));
    } catch (error) {
      notificationDialog.openDialog({
        title: (error as { shortMessage: string }).shortMessage,
        duration: 0,
      });
    }
  };

  const onInputChange = (amount: string) => {
    const amountAsBN = stringInputToBigNumber(amount, token.decimals);
    const sharesAmount = multiplyBigNumbers(
      amountAsBN,
      sharesRatioData,
      token.decimals
    );
    setInputBigNumber(sharesAmount);
    setInputAmount(amount);
  };

  const onPercentageChange = (percentage: number) => {
    // special case, use balance.value
    if (percentage === 100) return handleMaxClick();

    const sharesAmount = bigNumberPercentage(balance?.value, percentage); // shares amount
    setInputBigNumber(sharesAmount);
    const assetsAmount = bigNumberPercentage(assetsBalance, percentage); // assets amount
    setInputAmount(formatUnits(assetsAmount, token.decimals));
  };

  return (
    <WidgetComponent
      title="Withdraw"
      balance={assetsBalance}
      token={token}
      inputAmount={inputAmount}
      onInputChange={onInputChange}
      onMaxClick={handleMaxClick}
      onPercentageClick={onPercentageChange}
      onActionClick={handleClick}
      isBalanceLoading={isBalanceLoading}
      isMaxDisabled={isMaxDisabled}
      isButtonDisabled={isButtonDisabled}
      isButtonLoading={isButtonLoading}
      isApproved={true}
    />
  );
};

export default LendingWithdraw;
