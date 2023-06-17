import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { formatUnits } from "viem";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { type FC, useState } from "react";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { useToken } from "@/hooks/use-token.hook";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { useVault } from "@/hooks/use-vault.hook";
import { type LendingToken } from "@/types/onchain.types";
import {
  abbreviateBigNumber,
  bigNumberPercentage,
  multiplyBigNumbers,
  stringInputToBigNumber,
} from "@/utils/input.utils";

// this is the presentational component
interface WidgetComponentProps {
  title: string;
  balance: bigint | undefined;

  token: LendingToken;

  inputAmount: string;
  onInputChange: (value: string) => void;
  onMaxClick: () => void;
  onPercentageClick: (value: number) => void;
  onActionClick: () => Promise<void>;

  isBalanceLoading: boolean;
  isButtonDisabled: boolean;
  isButtonLoading: boolean;
  isApproved: boolean;
  isMaxDisabled: boolean;
}

interface TabSwitchProps {
  values: Array<{ title: string; value: string }>;
  onChange: (value: string) => void;
}

const TabSwitch: FC<TabSwitchProps> = ({ values, onChange }) => (
  <div className="flex flex-row gap-4">
    {values.map(({ title, value }) => (
      <Button key={value} onClick={() => onChange(value)} variant="outline">
        {title}
      </Button>
    ))}
  </div>
);

const WidgetComponent: React.FC<WidgetComponentProps> = ({
  title,
  balance,

  token,

  inputAmount,
  onInputChange,
  onMaxClick,
  onPercentageClick,
  onActionClick,

  isBalanceLoading,
  isMaxDisabled,
  isButtonDisabled,
  isButtonLoading,
  isApproved,
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  return (
    <div className="flex flex-col items-center gap-2 p-3 border md:p-4 lg:p-6 rounded-xl border-primary-300 bg-primary-contrast">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">{title}</Text>
        <div className="flex flex-row items-end justify-end gap-2">
          {isBalanceLoading ? (
            <Loading />
          ) : (
            <>
              <Text textStyle="lg">
                {abbreviateBigNumber(balance, token.decimals)}
              </Text>
              <Text textStyle="lg">
                (<EstimatedValue value={balance} token={token} />)
              </Text>
            </>
          )}
        </div>
      </div>

      <InputGroup size="md">
        <Input
          type="number"
          step="0.1"
          variant="filled"
          value={inputAmount}
          onChange={(event) => onInputChange(event.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={onMaxClick}
            isDisabled={isMaxDisabled}
            variant="insideInput"
          >
            Max
          </Button>
        </InputRightElement>
      </InputGroup>

      <TabSwitch
        onChange={(value: string) => {
          const percent = Number(value);
          onPercentageClick(percent);
        }}
        values={[...Array(4)].map((_, idx) => ({
          title: `${(idx + 1) * 25}%`,
          value: `${(idx + 1) * 25}`,
        }))}
      />

      {isConnected ? (
        <Button
          onClick={onActionClick}
          isDisabled={isButtonDisabled}
          isLoading={isButtonLoading}
          loadingText={isButtonLoading ? "Awaiting" : undefined}
        >
          {isApproved ? `${title} ${token.name}` : `Approve ${token.name}`}
        </Button>
      ) : (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      )}
    </div>
  );
};

interface LendingProps {
  token: LendingToken;
}

export const LendingDeposit: FC<LendingProps> = ({ token }) => {
  // state
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
  const { useAllowance, useApprove } = useToken(token.tokenAddress);
  const { usePrepareDeposit } = useVault(token, address);
  const { trackTransaction } = useTransactionFeedback();

  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    address,
    token.vaultAddress
  );
  const {
    data: approveData,
    isLoading: isApproveLoading,
    writeAsync: approve,
  } = useApprove(token.vaultAddress, inputBigNumber);
  const { isLoading: isApproveWaiting } = useWaitForTransaction({
    hash: approveData?.hash,
  });
  // deposit
  const { config: depositConfig } = usePrepareDeposit(inputBigNumber);
  const {
    data: depositData,
    isLoading: isDepositLoading,
    writeAsync: deposit,
  } = useContractWrite(depositConfig);
  const { isLoading: isDepositWaiting } = useWaitForTransaction({
    hash: depositData?.hash,
  });

  // computed properties
  const isApproved = (allowance ?? BigInt(0)) >= inputBigNumber;
  const isButtonLoading =
    isApproveLoading ||
    isApproveWaiting ||
    isDepositLoading ||
    isDepositWaiting;
  const isInconsistent = inputBigNumber>(balance?.value ?? 0);
  const isButtonDisabled =
    isButtonLoading || isInconsistent || inputBigNumber === BigInt(0);
  const isMaxDisabled = inputBigNumber === BigInt(balance?.value ?? 0);

  // handlers
  const handleMaxClick = () => {
    setInputAmount(balance?.formatted ?? "0");
  };

  const handleClick = async () => {
    if (!isApproved) {
      // after approval is successful, read again the allowance
      const result = await approve?.();
      await trackTransaction(result, `Approve ${inputAmount} ${token.name}`);
      await refetchAllowance();
      return;
    }
    const result = await deposit?.();
    await trackTransaction(result, `Deposit ${inputAmount} ${token.name}`);
    await refetchAllowance();
    setInputAmount("0");
  };

  return (
    <WidgetComponent
      title={"Deposit"}
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

export const LendingWithdraw: FC<LendingProps> = ({ token }) => {
  // state
  const [inputAmount, setInputAmount] = useState<string>("0");
  // in Withdraw, this represents Shares, not Assets
  const [inputBigNumber, setInputBigNumber] = useState<bigint>(
    BigInt(0)
  );
  const { address } = useAccount();

  // web3 hooks
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: token.vaultAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const {
    usePrepareRedeem,
    useMaxRedeem,
    useConvertToAssets,
    useConvertToShares,
  } = useVault(token, address);
  const { trackTransaction } = useTransactionFeedback();

  // withdraw
  const { config: redeemConfig, isError: isPrRedeemError } =
    usePrepareRedeem(inputBigNumber);
  const { isLoading: isWithdrawLoading, writeAsync: withdraw } =
    useContractWrite(redeemConfig);
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
  const isPrepareError = isPrRedeemError;
  const isInconsistent = inputBigNumber > BigInt(balance?.value ?? 0);
  const isButtonDisabled =
    isRequiredInfoLoading ||
    isButtonLoading ||
    isPrepareError ||
    isInconsistent ||
    inputBigNumber===BigInt(0);
  const isMaxDisabled = inputBigNumber===BigInt(balance?.value ?? 0);

  /**
   * withdraw logic
   * inputBigNumber will contain the amount of Shares to withdraw
   * if the user clicks Max or 100%, set the inputAmount to the balance
   * otherwise, convert the string input via convertToShares
   */

  // handlers
  const handleMaxClick = () => {
    setInputAmount(formatUnits(assetsBalance, token.decimals));
    // in case the user is the last one in the pool, maxRedeem will be slightly less than its balance
    // in that case, use the maxRedeem value or the tx will fail
    const maxRedeem =
      maxRedeemData != null &&
      balance != null &&
      balance.value>maxRedeemData
        ? maxRedeemData
        : balance?.value;
    setInputBigNumber(maxRedeem ?? BigInt(0));
  };

  const handleClick = async () => {
    const result = await withdraw?.();
    await trackTransaction(result, `Withdraw ${inputAmount} ${token.name}`);
    setInputAmount("0");
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
      title={"Withdraw"}
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

interface LendingProps {
  token: LendingToken;
}

export const Deposit: FC<LendingProps> = ({ token }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 lg:px-16 xl:px-24 md:flex-row">
      <LendingDeposit token={token} />
      <LendingWithdraw token={token} />
    </div>
  );
};
