import { HStack, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import React, { useState } from "react";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount, useBalance, useChainId, useContractWrite } from "wagmi";

import { gmxABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import {
  gmxAddress,
  useGmxLatestAndBase,
  useGmxRiskSpreads,
} from "@/hooks/generated/gmx";
import { useAllowance } from "@/hooks/useAllowance";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useBestLeverage } from "@/hooks/useBestLeverage";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePrepareDebitOrder } from "@/hooks/usePrepareOrder";
import { useRateAndSpread } from "@/hooks/useRateAndSpread";
import { Asset } from "@/types";
import { getServiceByName } from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import ServiceError from "../../ServiceError";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

const Form = ({ asset }: { asset: Asset }) => {
  const { address: accountAddress } = useAccount();
  const chainId = useChainId() as 98745;
  const [inputAmount, setInputAmount] = useState("");
  const [leverage, setLeverage] = useState(appConfig.DEFAULT_LEVERAGE);
  const [slippage, setSlippage] = useState(appConfig.DEFAULT_SLIPPAGE);
  const notificationDialog = useNotificationDialog();

  // web3 hooks

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
    serviceAddress: gmxAddress[chainId],
  });
  const extraData = encodeAbiParameters(parseAbiParameters("uint256"), [0n]);

  const { order } = usePrepareDebitOrder({
    token: asset,
    collateralToken: asset.gmxCollateralTokenAddress,
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
        notificationDialog.openError(error, "Failed");
      }
    },
    onError: (error) => notificationDialog.openError(error, "Failed"),
  });

  // computed properties
  const isButtonLoading = isInterestAndSpreadLoading;
  const isButtonDisabled = isButtonLoading || +inputAmount === 0;
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "0");
  };

  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const { baseApy, isLoading: apyLoading } = useBaseApy("GMX");

  console.log("baseApyGMX", baseApy);

  const { data: latestAndBase } = useGmxLatestAndBase({
    args: [asset.tokenAddress],
  });

  const { data: riskSpreads } = useGmxRiskSpreads({
    args: [asset.tokenAddress],
  });

  const { bestLeverage, isLoading: isBestLeverageLoading } = useBestLeverage({
    baseApy,
    latestAndBase,
    riskSpreads,
  });

  console.log("latestAndBase", latestAndBase);
  console.log("riskSpreads", riskSpreads);

  const finalLeverage = isAdvancedOptionsOpen
    ? leverage
    : (+bestLeverage - 1).toString();

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
      value: finalApy?.toFixed(2),
      extension: "%",
      isLoading: isInterestAndSpreadLoading,
    },
  ];
  const tokens = getServiceByName("gmx").tokens;

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
        onClick={() => (isApproved ? openPosition() : approve?.())}
        isDisabled={isButtonDisabled}
        loadingText="Waiting"
        mt="20px"
        isLoading={isButtonLoading}
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Open position"
          : `Approve ${asset.name}`}
      </PrivateButton>
    </div>
  );
};

export default Form;
