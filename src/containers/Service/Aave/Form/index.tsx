import { HStack, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import React, { useEffect, useState } from "react";
import { toHex } from "viem";
import { Address } from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";

import { aaveABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import {
  aaveAddress,
  useAaveLatestAndBase,
  useAaveRiskSpreads,
} from "@/hooks/generated/aave";
import { useAllowance } from "@/hooks/useAllowance";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useBestLeverage } from "@/hooks/useBestLeverage";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePrepareDebitOrder } from "@/hooks/usePrepareOrder";
import { useRateAndSpread } from "@/hooks/useRateAndSpread";
import { Asset } from "@/types";
import { cutoffDecimals, getServiceByName, normalizeInputValue } from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import ServiceError from "../../ServiceError";
import SingleAssetAmount from "../../SingleAssetAmount";

const Form = ({ asset }: { asset: Asset }) => {
  const { address: accountAddress } = useAccount();
  const [inputAmount, setInputAmount] = useState("");
  const [leverage, setLeverage] = useState("0");
  const [slippage, setSlippage] = useState(appConfig.DEFAULT_SLIPPAGE);
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
  const notificationDialog = useNotificationDialog();

  const normalizeLeverage = normalizeInputValue(leverage);

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
    spender: aaveAddress,
    token: asset,
  });

  const { baseApy, isLoading: apyLoading } = useBaseApy(asset.name);

  const { data: latestAndBase } = useAaveLatestAndBase({
    args: [asset.tokenAddress],
  });

  const { data: riskSpreads } = useAaveRiskSpreads({
    args: [asset.tokenAddress],
  });

  const { bestLeverage, isLoading: isBestLeverageLoading } = useBestLeverage({
    baseApy,
    latestAndBase,
    riskSpreads,
  });

  useEffect(() => {
    if (bestLeverage) setLeverage(bestLeverage.toString());
  }, [bestLeverage]);

  console.log("test: leverage normalizeLeverage", normalizeLeverage);
  console.log("test: leverage bestLeverage", bestLeverage);

  const finalLeverage = (
    isAdvancedOptionsOpen ? +normalizeLeverage : +bestLeverage
  ).toString();

  console.log("finalLeverage", finalLeverage);

  const {
    interestAndSpread,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
    isInterestError,
    isFreeLiquidityError,
  } = useRateAndSpread({
    token: asset,
    leverage: finalLeverage,
    margin: inputAmount,
    slippage,
    serviceAddress: aaveAddress,
  });

  const extraData = toHex("");

  const { order } = usePrepareDebitOrder({
    token: asset,
    collateralToken: asset.aaveCollateralTokenAddress,
    leverage: finalLeverage,
    amount: inputAmount,
    interestAndSpread,
    extraData,
  });

  const {
    data: openData,
    isLoading: isOpenLoading,
    write: openPosition,
  } = useContractWrite({
    mode: "prepared",
    request: {
      abi: aaveABI,
      address: aaveAddress,
      functionName: "open",
      args: [order],
      account: accountAddress as Address,
      chain: undefined,
      gas: 3_000_000n,
    },
    onMutate: async () => {
      notificationDialog.openLoading(
        isApproved ? "Opening position" : "Approving"
      );
    },
    onSuccess: async ({ hash }) => {
      try {
        await waitForTransaction({
          hash,
        });
        notificationDialog.openSuccess(
          isApproved ? "Positions opened successfully" : "Approved successfully"
        );
        setInputAmount("");
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError("Failed", error),
  });

  // computed properties
  const isButtonLoading = isInterestAndSpreadLoading;
  const isButtonDisabled =
    +inputAmount === 0 || isInterestError || isFreeLiquidityError;
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const isMounted = useIsMounted();

  const finalApy = baseApy
    ? +baseApy * +finalLeverage -
      (+finalLeverage - 1) * displayInterestAndSpreadInPercent
    : 0;

  const formInfoItems = [
    {
      label: "Base APY:",
      value: baseApy?.toFixed(2),
      extension: "%",
      isLoading: apyLoading,
    },
    {
      label: "Best Leverage:",
      value: bestLeverage,
      extension: "x",
      isLoading: isBestLeverageLoading,
    },
    {
      label: "Borrow Interest:",
      value: displayInterestAndSpreadInPercent,
      extension: "%",
      isLoading: isInterestAndSpreadLoading,
    },
    {
      label: "Final APY:",
      value: cutoffDecimals(finalApy, 2),
      extension: "%",
      isLoading: isInterestAndSpreadLoading,
    },
  ];

  const tokens = getServiceByName("aave").tokens;
  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-2 p-3 bg-primary-100 rounded-xl">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">Open Position</Text>
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
          switchableAsset={true}
          tokens={tokens}
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
      <PrivateButton
        isDisabled={isButtonDisabled}
        loadingText="Waiting"
        mt="20px"
        isLoading={isButtonLoading}
        onClick={() => (isApproved ? openPosition?.() : approve?.())}
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Invest"
          : `Approve ${asset.name}`}
      </PrivateButton>
    </div>
  );
};

export default Form;
