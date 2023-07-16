import { HStack, Text } from "@chakra-ui/react";
import { Box, Button, useColorMode } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { gmxABI } from "@/abi";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { getDecimalRegex } from "@/data/regex";
import { aaveAddress } from "@/hooks/generated/aave";
import { gmxAddress } from "@/hooks/generated/gmx";
import { useToken } from "@/hooks/use-token.hook";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useNotificationDialog } from "@/hooks/useNotificationDialog";
import { useGmxPrepareOrder } from "@/hooks/usePrepareOrder";
import { useTransaction } from "@/hooks/useTransaction";
import { AaveAsset } from "@/types/onchain.types";
import {
  abbreviateBigNumber,
  stringInputToBigNumber,
} from "@/utils/input.utils";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

const Form = ({ asset }: { asset: AaveAsset }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() as 98745;
  const [inputAmount, setInputAmount] = useState<string>("0");
  const inputBigNumber = asset?.decimals
    ? stringInputToBigNumber(inputAmount, asset?.decimals)
    : 0n;
  const [leverage, setLeverage] = useState("1.5");
  const [slippage, setSlippage] = useState("0.1");
  const notificationDialog = useNotificationDialog();

  // web3 hooks

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const { useAllowance, useApprove } = useToken(asset?.tokenAddress);
  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    address,
    aaveAddress[chainId]
  );
  const {
    data: approveData,
    isLoading: isApproveLoading,
    write: approve,
  } = useApprove(aaveAddress[chainId], inputBigNumber);
  const { isLoading: isApproveWaiting } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  const {
    order,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
  } = useGmxPrepareOrder(
    asset?.tokenAddress,
    asset?.collateralTokenAddress,
    inputBigNumber,
    +leverage
  );

  const { address: accountAddress } = useAccount();
  const {
    data: openData,
    isLoading: isOpenLoading,
    write: openPosition,
  } = useContractWrite({
    abi: gmxABI,
    address: gmxAddress[98745],
    functionName: "open",
    args: [order],
    account: accountAddress,
    onSuccess: () => {
      setInputAmount("0");
    },
    onError(error) {
      // notificationDialog.openDialog({
      //   title: (error as { shortMessage: string }).shortMessage,
      //   status: "error",
      // });
    },
  });

  const { isLoading: isOpenWaiting } = useWaitForTransaction({
    hash: openData?.hash,
  });

  // computed properties
  const isApproved = allowance ? allowance >= inputBigNumber : false;
  const isButtonLoading =
    isApproveLoading || isApproveWaiting || isOpenLoading || isOpenWaiting;
  const isInconsistent = inputBigNumber > (balance?.value ?? 0);
  const isButtonDisabled =
    isButtonLoading || isInconsistent || inputBigNumber === BigInt(0);
  const isMaxDisabled = inputBigNumber === (balance?.value ?? 0);

  const onInputChange = (value: string) => {
    if (!asset?.decimals) return;
    if (getDecimalRegex(asset?.decimals).test(value) || value === "")
      setInputAmount(value);
  };
  useTransaction(
    openData?.hash,
    `${!isApproved ? "Deposit" : "Approve"} ${inputAmount} ${asset?.name}`
  );

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "0");
  };

  const { openConnectModal } = useConnectModal();
  const isMounted = useIsMounted();

  const { colorMode } = useColorMode();
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const { baseApy, isLoading: apyLoading } = useBaseApy("GMX");
  const finalLeverage = isAdvancedOptionsOpen ? leverage : 1.5;
  const finalApy = baseApy
    ? (+baseApy * +finalLeverage - displayInterestAndSpreadInPercent).toFixed(2)
    : "";

  const formInfoItems = [
    {
      label: "Base APY:",
      value: baseApy?.toFixed(2),
      extension: "%",
      isLoading: apyLoading,
    },
    {
      label: "Best Leverage:",
      value: finalLeverage,
      extension: "x",
    },
    {
      label: "Borrow Interest:",
      value: displayInterestAndSpreadInPercent,
      extension: "%",
      // isLoading={isLoading}
    },
    {
      label: "Final APY:",
      value: finalApy,
      extension: "%",
    },
  ];

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-2 p-3 bg-primary-100 rounded-xl">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">Deposit</Text>
        <div className="flex flex-row items-center justify-end gap-2">
          {isBalanceLoading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              <Text textStyle="slender-sm2">
                {abbreviateBigNumber(
                  balance?.value ?? BigInt(0),
                  asset.decimals
                )}
              </Text>
              <HStack textStyle="slender-sm2">
                <EstimatedValue
                  value={balance?.value ?? BigInt(0)}
                  token={asset!}
                />
              </HStack>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <SingleAssetAmount
          asset={asset}
          onMaxClick={onMaxClick}
          isMaxDisabled={isMaxDisabled}
          value={inputAmount}
          onChange={setInputAmount}
          switchableAsset={false}
        />

        <Box width="full" gap="30px">
          <FormInfo items={formInfoItems} />

          <AdvanceSection
            isAdvancedOptionsOpen={isAdvancedOptionsOpen}
            setIsAdvancedOptionsOpen={setIsAdvancedOptionsOpen}
            leverage={leverage}
            setLeverage={setLeverage}
            setSlippage={setSlippage}
            slippage={slippage}
          />
        </Box>
      </div>

      <>
        {isConnected ? (
          <Button
            mt="20px"
            onClick={isApproved ? () => openPosition() : approve}
            isDisabled={isButtonDisabled}
            isLoading={isButtonLoading}
            loadingText={isButtonLoading ? "Waiting" : undefined}
          >
            {!asset
              ? "Loading..."
              : isApproved
              ? "Open position"
              : `Approve ${asset?.name}`}
          </Button>
        ) : (
          <Button mt="20px" onClick={openConnectModal}>
            Connect Wallet
          </Button>
        )}
      </>
    </div>
  );
};

export default Form;
