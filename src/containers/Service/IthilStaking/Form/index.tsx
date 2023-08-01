import { FormLabel, HStack, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toHex } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";

import PrivateButton from "@/components/PrivateButton";
import Slider from "@/components/Slider";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { aaveAddress } from "@/hooks/generated/aave";
import { useAllowance } from "@/hooks/useAllowance";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useIsMounted } from "@/hooks/useIsMounted";
import { AaveAsset } from "@/types/onchain.types";
import {
  displayLeverage,
  getServiceByName,
  getSingleQueryParam,
} from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

// import AdvancedFormLabel from "./AdvancedFormLabel";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

const Form = ({ asset }: { asset: AaveAsset }) => {
  const {
    query: { asset: token },
  } = useRouter();
  const { address: accountAddress } = useAccount();
  const chainId = useChainId() as 98745;
  const [inputAmount, setInputAmount] = useState("");
  const [leverage, setLeverage] = useState(appConfig.DEFAULT_LEVERAGE);
  const [slippage, setSlippage] = useState(appConfig.DEFAULT_SLIPPAGE);
  const [month, setMonth] = useState(1);
  const notificationDialog = useNotificationDialog();
  console.log("leverage:", leverage, "slippage:", slippage);

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: accountAddress,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const tokens = getServiceByName("ithil-staking").tokens;

  const {
    isApproved,
    isLoading: isApproveLoading,
    write: approve,
  } = useAllowance({
    amount: inputAmount,
    spender: aaveAddress[chainId],
    token: asset,
  });

  // const {
  //   interestAndSpread,
  //   displayInterestAndSpreadInPercent,
  //   isInterestAndSpreadLoading,
  //   isInterestError,
  //   isFreeLiquidityError,
  // } = useRateAndSpread({
  //   token: asset,
  //   leverage,
  //   margin: inputAmount,
  //   slippage,
  //   serviceAddress: aaveAddress[chainId],
  // });

  const extraData = toHex("");

  // const { order } = usePrepareDebitOrder({
  //   token: asset,
  //   collateralToken: asset?.collateralTokenAddress,
  //   leverage,
  //   amount: inputAmount,
  //   interestAndSpread,
  //   extraData,
  // });

  // const {
  //   data: openData,
  //   isLoading: isOpenLoading,
  //   write: openPosition,
  // } = useContractWrite({
  //   abi: aaveABI,
  //   address: aaveAddress[98745],
  //   functionName: "open",
  //   args: [order],
  //   account: accountAddress as Address,
  //   onMutate: async () => {
  //     notificationDialog.openDialog({
  //       title: isApproved ? "Opening position" : "Approving",
  //       status: "loading",
  //     });
  //   },
  //   onSuccess: async ({ hash }) => {
  //     try {
  //       await waitForTransaction({
  //         hash,
  //       });
  //       notificationDialog.openDialog({
  //         title: isApproved
  //           ? "Positions opened successfully"
  //           : "Approved successfully",
  //         status: "success",
  //         isClosable: true,
  //       });
  //       setInputAmount("");
  //     } catch (error) {
  //       notificationDialog.openDialog({
  //         title: "Failed",
  //         description: getMetaError(error),
  //         status: "error",
  //         isClosable: true,
  //       });
  //     }
  //   },
  //   onError: (error) => {
  //     notificationDialog.openDialog({
  //       title: "Failed",
  //       description: getMetaError(error),
  //       status: "error",
  //       isClosable: true,
  //     });
  //   },
  // });

  // computed properties
  // const isButtonLoading = isInterestAndSpreadLoading;
  const isButtonLoading = false;
  // const isButtonDisabled =
  //   +inputAmount === 0 || isInterestError || isFreeLiquidityError;

  const isButtonDisabled = false;
  // const isMaxDisabled = inputAmount === balance?.value.toString();
  const isMaxDisabled = true;

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const isMounted = useIsMounted();

  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const { baseApy, isLoading: apyLoading } = useBaseApy(
    getSingleQueryParam(token)
  );
  const _finalLeverage = isAdvancedOptionsOpen
    ? displayLeverage(leverage)
    : displayLeverage(appConfig.DEFAULT_LEVERAGE);
  // const finalApy = baseApy
  //   ? (+baseApy * +finalLeverage - displayInterestAndSpreadInPercent).toFixed(2)
  //   : "";

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
          switchableAsset={false}
          tokens={tokens}
        />

        <Box width="full" gap="30px">
          {/* <FormInfo items={formInfoItems} /> */}
          <FormLabel marginTop={4}>Maturity time in months</FormLabel>
          <Box margin="10px 10px 20px">
            <Slider value={month} onChange={setMonth} />
          </Box>

          {/* <AdvanceSection
            isAdvancedOptionsOpen={isAdvancedOptionsOpen}
            setIsAdvancedOptionsOpen={setIsAdvancedOptionsOpen}
            leverage={leverage}
            setLeverage={setLeverage}
            setSlippage={setSlippage}
            slippage={slippage}
          /> */}
        </Box>
      </div>

      {/* <ServiceError
        isFreeLiquidityError={isFreeLiquidityError}
        isInterestError={isInterestError}
      /> */}
      <PrivateButton
        isDisabled={isButtonDisabled}
        isLoading={isButtonLoading}
        loadingText="Waiting"
        onClick={approve}
        mt="20px"
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Deposit"
          : `Approve ${asset.name}`}
      </PrivateButton>

      <PrivateButton
        isDisabled={isButtonDisabled}
        isLoading={isButtonLoading}
        loadingText="Waiting"
        onClick={approve}
        mt="20px"
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Claim 0 WETH"
          : `Approve ${asset.name}`}
      </PrivateButton>
    </div>
  );
};

export default Form;
