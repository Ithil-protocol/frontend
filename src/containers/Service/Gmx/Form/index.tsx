import { HStack, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { encodeAbiParameters, formatUnits, parseAbiParameters } from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";

import { aaveABI, gmxABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { usePositionModal } from "@/contexts/PositionModal";
import {
  gmxAddress,
  useGmxComputeBaseRateAndSpread,
  useGmxRiskSpreads,
} from "@/hooks/generated/gmx";
import { useAllowance } from "@/hooks/useAllowance";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useBestLeverage } from "@/hooks/useBestLeverage";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useMinMarginLimit } from "@/hooks/useMinMarginLimit";
import { usePrepareDebitOrder } from "@/hooks/usePrepareOrder";
import { useRateAndSpread } from "@/hooks/useRateAndSpread";
import { Asset } from "@/types";
import {
  cutoffDecimals,
  getServiceByName,
  getSingleQueryParam,
  normalizeInputValue,
} from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import ServiceError from "../../ServiceError";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

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
    spender: gmxAddress,
    token: asset,
  });

  const { isLessThanMinimumMarginError, isMinMarginLoading } =
    useMinMarginLimit({
      abi: aaveABI,
      asset,
      inputAmount,
      serviceAddress: gmxAddress,
    });

  const { baseApy, isLoading: apyLoading } = useBaseApy("GMX");

  const { data: latestAndBase } = useGmxComputeBaseRateAndSpread({
    args: [asset.tokenAddress, 0n, 0n, 1n],
  });

  const { data: riskSpreads } = useGmxRiskSpreads({
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

  const finalLeverage = (
    isAdvancedOptionsOpen ? +normalizeLeverage - 1 : +bestLeverage - 1
  ).toString();

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
    serviceAddress: gmxAddress,
  });
  const extraData = encodeAbiParameters(parseAbiParameters("uint256"), [0n]);

  const {
    query: { asset: token },
  } = useRouter();

  const { order } = usePrepareDebitOrder({
    token: asset,
    collateralToken: asset.gmxCollateralTokenAddress,
    leverage: finalLeverage,
    amount: inputAmount,
    interestAndSpread,
    extraData,
    slippage,
  });

  const {
    data: openData,
    isLoading: isOpenLoading,
    write: openPosition,
  } = useContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "open",
    args: [order],
    account: accountAddress,
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
          isApproved ? "Position successfully opened" : "Approved successfully"
        );
        setInputAmount("");
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError("Failed", error),
  });

  // computed properties
  const isButtonLoading = isInterestAndSpreadLoading || isMinMarginLoading;
  const isButtonDisabled =
    +inputAmount === 0 ||
    isInterestError ||
    isFreeLiquidityError ||
    isLessThanMinimumMarginError;
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const isMounted = useIsMounted();

  console.log(
    "gmxLeverage",
    "leverageInPrepare:",
    finalLeverage,
    "leverageInApy:",
    leverage
  );
  const finalApy = baseApy
    ? +baseApy * +leverage - (+leverage - 1) * displayInterestAndSpreadInPercent
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
  const { tokens } = getServiceByName("gmx");

  const positionModal = usePositionModal({
    isClosable: true,
    isSubmitDisabled: isButtonDisabled,
    isSubmitLoading: isButtonLoading,
    onSubmit: () => openPosition?.(),
    submitText: "Invest",
    title: "Open Position",
  });

  const handleOpenPositionModal = () => {
    positionModal.open({
      amount: inputAmount,
      leverage,
      position: "gmx",
      slippage,
      token: getSingleQueryParam(token),
      collateral: formatUnits(
        order.agreement.collaterals[0].amount,
        asset.decimals
      ),
    });
  };

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
          switchableAsset
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
        isLessThanMinimumMarginError={isLessThanMinimumMarginError}
      />
      <PrivateButton
        onClick={() => (isApproved ? handleOpenPositionModal() : approve?.())}
        isDisabled={isButtonDisabled}
        loadingText="Waiting"
        mt="20px"
        isLoading={isButtonLoading}
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Invest"
          : `Approve ${asset.label}`}
      </PrivateButton>
    </div>
  );
};

export default Form;
