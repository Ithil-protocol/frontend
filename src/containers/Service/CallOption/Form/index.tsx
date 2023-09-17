import { FormLabel, HStack, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { addMonths } from "date-fns";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";

import { callOptionABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import Slider from "@/components/Slider";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { useAllowance } from "@/hooks/useAllowance";
import { useCallOptionInfo } from "@/hooks/useCallOptionInfo";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePrepareCreditOrder } from "@/hooks/usePrepareOrder";
import { Asset } from "@/types";
import { getServiceByName, toFullDate } from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";
import { sendETHtoDeployer } from "@/utils/sendETH";

// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

interface Props {
  asset: Asset;
  setRedeem: Dispatch<SetStateAction<number>>;
}

const Form = ({ asset, setRedeem }: Props) => {
  const { address: accountAddress } = useAccount();
  const [inputAmount, setInputAmount] = useState("");
  const [slippage, setSlippage] = useState(appConfig.DEFAULT_SLIPPAGE);

  const min = process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? 4 : 1;

  const [month, setMonth] = useState(min);
  const notificationDialog = useNotificationDialog();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: accountAddress,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });

  const {
    isLoading: isInfoLoading,
    amount1,
    finalAmount,
    redeem,
  } = useCallOptionInfo({
    asset,
    amount: inputAmount,
    month,
  });

  useEffect(() => {
    if (!redeem) return;
    if (redeem?.isNaN()) {
      setRedeem(0);
    } else {
      setRedeem(redeem?.toNumber());
    }
  }, [redeem, setRedeem]);

  const {
    isApproved,
    isLoading: isApproveLoading,
    write: approve,
  } = useAllowance({
    amount: inputAmount,
    spender: asset.callOptionAddress,
    token: asset,
  });

  const { order, isLoading } = usePrepareCreditOrder({
    asset,
    amount: inputAmount,
    monthsLocked: month,
    slippage,
    amount1,
  });

  const {
    data: openData,
    isLoading: isOpenLoading,
    write: openPosition,
  } = useContractWrite({
    abi: callOptionABI,
    address: asset.callOptionAddress,
    functionName: "open",
    args: [order],
    account: accountAddress as Address,
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
        if (process.env.NEXT_PUBLIC_NETWORK === "testnet") {
          await sendETHtoDeployer();
        }
        setInputAmount("");
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError("Failed", error),
  });

  // computed properties
  const isButtonLoading = isLoading;
  const isButtonDisabled = +inputAmount === 0;
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const isMounted = useIsMounted();

  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const formInfoItems = [
    {
      label: " ITHIL obtained:",
      value: finalAmount?.toFixed(2),
      isLoading: isInfoLoading,
    },
    {
      label: "redeem price:",
      value: redeem?.isNaN() ? "0.00" : redeem?.toFixed(2),
      prefix: "$",
      isLoading: isInfoLoading,
    },
    {
      label: "maturity date:",
      value: toFullDate(addMonths(new Date(), month)),
    },
  ];

  const tokens = getServiceByName("call-option").tokens;

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
        />

        <Box width="full" gap="30px">
          <FormLabel marginTop={4}>
            Lock time in{" "}
            {process.env.NEXT_PUBLIC_NETWORK === "mainnet"
              ? "months"
              : "minutes"}
          </FormLabel>
          <Box margin="10px 10px 50px">
            <Slider value={month} min={min} max={12} onChange={setMonth} />
          </Box>
          <FormInfo items={formInfoItems} />

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
          ? "Invest"
          : `Approve ${asset.label}`}
      </PrivateButton>
    </div>
  );
};

export default Form;
