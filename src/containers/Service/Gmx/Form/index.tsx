import {
  Flex,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Address,
  encodeAbiParameters,
  formatUnits,
  parseAbiParameters,
} from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";

import { aaveABI, gmxABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { PositionModal } from "@/contexts/PositionModal";
import {
  gmxAddress,
  useGmxHalvingTime,
  useGmxLatestAndBase,
  useGmxRiskSpreads,
} from "@/hooks/generated/gmx";
import { useManagerCaps } from "@/hooks/generated/manager";
import {
  useVaultFreeLiquidity,
  useVaultNetLoans,
} from "@/hooks/generated/vault";
import { useAllowance } from "@/hooks/useAllowance";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useBestLeverage } from "@/hooks/useBestLeverage";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useMinMarginLimit } from "@/hooks/useMinMarginLimit";
import { usePrepareGmxOrder } from "@/hooks/usePrepareOrder";
import { useRateAndSpread } from "@/hooks/useRateAndSpread";
import { Asset } from "@/types";
import { getAssetByName, getSingleQueryParam } from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

import FormInfo from "../../FormInfo";
import ServiceError from "../../ServiceError";
import SingleAssetAmount from "../../SingleAssetAmount";

const Form = ({ asset }: { asset: Asset }) => {
  const { address: accountAddress } = useAccount();
  const [inputAmount, setInputAmount] = useState("");
  const [leverage, setLeverage] = useState("1.1");
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [slippage, setSlippage] = useState(appConfig.DEFAULT_SLIPPAGE);
  const notificationDialog = useNotificationDialog();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: accountAddress,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });

  const {
    isApproved,
    write: approve,
    isAllowanceRefetching,
  } = useAllowance({
    amount: inputAmount,
    spender: gmxAddress,
    token: asset,
  });

  const { isLessThanMinimumMarginError, isMinMarginLoading, bigintAmount } =
    useMinMarginLimit({
      abi: aaveABI,
      asset,
      inputAmount,
      serviceAddress: gmxAddress,
    });

  const { baseApy, isLoading: apyLoading } = useBaseApy("GMX");

  const { data: latestAndBase } = useGmxLatestAndBase({
    args: [asset.tokenAddress],
  });

  const { data: riskSpreads } = useGmxRiskSpreads({
    args: [asset.tokenAddress],
  });

  const { data: halvingTime } = useGmxHalvingTime({
    args: [asset.tokenAddress],
  });

  const { data: freeLiquidity } = useVaultFreeLiquidity({
    address: asset?.vaultAddress as Address,
    enabled: !!asset,
  });

  const { data: netLoans } = useVaultNetLoans({
    address: asset?.vaultAddress as Address,
    enabled: !!asset,
  });

  const { data: caps } = useManagerCaps({
    args: [gmxAddress, asset.tokenAddress],
  });

  const { maxLeverage } = useBestLeverage({
    baseApy,
    latestAndBase,
    riskSpreads,
    halvingTime,
    freeLiquidity,
    bigintAmount,
    netLoans,
    caps,
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
    serviceAddress: gmxAddress,
  });
  const extraData = encodeAbiParameters(parseAbiParameters("uint256"), [0n]);

  const {
    query: { asset: token },
  } = useRouter();

  // TODO: change to USDG
  const { order } = usePrepareGmxOrder({
    token: asset,
    collateralTokens: [
      asset.gmxCollateralTokenAddress,
      asset.gmxCollateralTokenAddress,
    ],
    leverage,
    amount: inputAmount,
    interestAndSpread,
    extraData,
    slippage,
  });

  const { write: openPosition } = useContractWrite({
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
  const isButtonLoading =
    isInterestAndSpreadLoading || isMinMarginLoading || isAllowanceRefetching;
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
    leverage,
    "leverageInApy:",
    leverage
  );

  const formInfoItems = [
    {
      label: "ETH Rewards APY:",
      value: baseApy?.toFixed(2),
      extension: "%",
      isLoading: apyLoading,
    },
    {
      label: "Borrow Interest:",
      value: displayInterestAndSpreadInPercent,
      extension: "%",
      isLoading: isInterestAndSpreadLoading,
    },
  ];

  const maxLeverageToDisplay = useCallback(
    (minLeverage: number) => {
      const max =
        maxLeverage !== "Infinity"
          ? (parseFloat(maxLeverage || "5") * 4) / 5
          : 5;
      return max < minLeverage ? minLeverage : max > 5 ? 5 : max;
    },
    [maxLeverage]
  );

  useEffect(() => {
    const max = maxLeverageToDisplay(1.1);
    if (parseFloat(leverage) > max) {
      setLeverage(max.toString());
    }
  }, [maxLeverageToDisplay, leverage, setLeverage]);

  if (!isMounted) return null;

  const renderLeverageSlider = (isDisabled: boolean) => (
    <Slider
      aria-label="slider-ex-1"
      min={1.1}
      max={maxLeverageToDisplay(1.1)}
      step={0.1}
      value={parseFloat(leverage)}
      onChange={(val) => setLeverage(val.toString())}
      isDisabled={isDisabled}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize={4} />
    </Slider>
  );

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
          <Flex justify="space-between" align="center" mb="8px" mt="12px">
            <Text>Leverage: </Text>
            <Text>{leverage}</Text>
          </Flex>
          {+inputAmount === 0 ? (
            <Tooltip label="Insert a nonzero margin first" placement="top">
              <Box>{renderLeverageSlider(true)}</Box>
            </Tooltip>
          ) : (
            renderLeverageSlider(false)
          )}
          <Flex justify="space-between" align="center" mb="8px" mt="12px">
            <Text>Slippage: </Text>
            <Text>{(parseFloat(slippage) * 100).toFixed(1)}%</Text>
          </Flex>

          <Slider
            aria-label="slider-ex-1"
            min={0.001}
            max={0.1}
            step={0.009}
            value={parseFloat(slippage)}
            onChange={(val) => setSlippage(val.toString())}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={4}></SliderThumb>
          </Slider>
        </Box>
      </div>

      {inputAmount !== "" && (
        <ServiceError
          isFreeLiquidityError={isFreeLiquidityError}
          isInterestError={isInterestError}
          isLessThanMinimumMarginError={isLessThanMinimumMarginError}
        />
      )}

      <PrivateButton
        onClick={() => (isApproved ? onOpen() : approve?.())}
        isDisabled={isButtonDisabled || +inputAmount === 0}
        loadingText="Waiting"
        isLoading={isButtonLoading && +inputAmount != 0}
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Invest"
          : `Approve ${asset.label}`}
      </PrivateButton>

      <PositionModal
        canShowSlippageSlider={false}
        canShowPercentageSlider={false}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={openPosition}
        submitText="Invest"
        title="Open Position"
        data={{
          gmxCollateral: formatUnits(
            order.agreement.collaterals[0].amount,
            asset.decimals
          ),
          leverage,
          margin: inputAmount,
          position: "gmx",
          slippage: (+slippage * 100).toString(),
          assetName: getSingleQueryParam(token),
          assetLabel: getAssetByName(getSingleQueryParam(token))?.label,
        }}
      />
    </div>
  );
};

export default Form;
