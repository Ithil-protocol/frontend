import { HStack, Text } from "@chakra-ui/react";
import { Box, Button } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { encodeAbiParameters, parseAbiParameters } from "viem";
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
import { gmxAddress } from "@/hooks/generated/gmx";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { useAllowance } from "@/hooks/useAllowance";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useNotificationDialog } from "@/hooks/useNotificationDialog";
import { usePrepareOrder } from "@/hooks/usePrepareOrder";
import { useRateAndSpread } from "@/hooks/useRateAndSpread";
import { Asset } from "@/types";
import { abbreviateBigNumber } from "@/utils/input.utils";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import ServiceError from "../../ServiceError";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

const Form = ({ asset }: { asset: Asset }) => {
  const { address: accountAddress, isConnected } = useAccount();
  const chainId = useChainId() as 98745;
  const [inputAmount, setInputAmount] = useState<string>("0");
  const [leverage, setLeverage] = useState("1.5");
  const [slippage, setSlippage] = useState("0.1");
  const notificationDialog = useNotificationDialog();

  // web3 hooks
  const { trackTransaction } = useTransactionFeedback();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: accountAddress,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });

  const {
    isApproved,
    isLoading: isApproveLoading,
    write: approve,
  } = useAllowance({
    amount: inputAmount,
    spender: gmxAddress[chainId],
    token: asset,
  });

  const {
    interestAndSpread,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
    isInterestError,
    isFreeLiquidityError,
  } = useRateAndSpread({
    token: asset,
    leverage,
    margin: inputAmount,
    slippage,
  });
  const extraData = encodeAbiParameters(parseAbiParameters("uint256"), [0n]);

  const { order } = usePrepareOrder({
    token: asset,
    collateralToken: asset?.collateralTokenAddress,
    leverage,
    amount: inputAmount,
    interestAndSpread,
    extraData,
  });

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
    onMutate: () => {
      notificationDialog.openDialog({
        title: `${isApproved ? "Deposit" : "Approve"} ${inputAmount} ${
          asset?.name
        }`,
        status: "loading",
        duration: 0,
      });
    },
  });

  const { isLoading: isOpenWaiting } = useWaitForTransaction({
    hash: openData?.hash,
    onSuccess: () => {
      notificationDialog.openDialog({
        title: `${isApproved ? "Approve" : "Deposit"} ${inputAmount} ${
          asset.name
        }`,
        status: "success",
        isClosable: true,
        duration: 0,
      });
      setInputAmount("0");
    },
    onError: (err) => {
      notificationDialog.openDialog({
        title: `${err.message}`,
        status: "error",
        isClosable: true,
        duration: 0,
      });
    },
  });

  // useTransaction(
  //   openData?.hash,
  //   `${!isApproved ? "Approve" : "Deposit"} ${inputAmount} ${asset?.name}`
  // );

  // computed properties
  const isButtonLoading = isApproveLoading || isOpenLoading || isOpenWaiting;
  const isButtonDisabled = isButtonLoading || inputAmount === "0";
  const isMaxDisabled = inputAmount === (balance?.value.toString() ?? "0");

  console.log("yyyy isApproveLoading", isApproveLoading);
  console.log("yyyy isOpenLoading", isOpenLoading);
  console.log("yyyy isOpenWaiting", isOpenWaiting);

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "0");
  };

  const { openConnectModal } = useConnectModal();
  const isMounted = useIsMounted();

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

      <ServiceError
        isFreeLiquidityError={isFreeLiquidityError}
        isInterestError={isInterestError}
      />
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
