import { FormLabel, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { addMonths } from "date-fns";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";

import { callOptionABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import Slider from "@/components/Slider";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { PositionModal } from "@/contexts/PositionModal";
import { useAllowance } from "@/hooks/useAllowance";
import { useCallOptionInfo } from "@/hooks/useCallOptionInfo";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePrepareCreditOrder } from "@/hooks/usePrepareOrder";
import { Asset } from "@/types";
import { getAssetByName, getSingleQueryParam, toFullDate } from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";
import { sendETHtoDeployer } from "@/utils/sendETH";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import ServiceError from "../../ServiceError";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

interface Props {
  asset: Asset;
  setRedeem: Dispatch<SetStateAction<number>>;
}

const Form = ({ asset, setRedeem }: Props) => {
  const { address: accountAddress } = useAccount();
  const [inputAmount, setInputAmount] = useState("");
  const [slippage, setSlippage] = useState("0.01");
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] =
    useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

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
    slippage,
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
    write: approve,
    isAllowanceRefetching,
  } = useAllowance({
    amount: inputAmount,
    spender: asset.callOptionAddress,
    token: asset,
  });

  const { order, isLoading } = usePrepareCreditOrder({
    asset,
    amount: inputAmount,
    monthsLocked: month,
    amount1,
  });

  const { write: openPosition } = useContractWrite({
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
          isApproved ? "Position successfully opened" : "Approved successfully"
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
  const isButtonLoading = isLoading || isAllowanceRefetching;
  const isButtonDisabled = +inputAmount === 0 || finalAmount.isNegative();
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const isMounted = useIsMounted();

  const maturityDate = toFullDate(addMonths(new Date(), month));
  const redeemPrice = redeem?.isNaN() ? "0.00" : redeem?.toFixed(2);
  const ithilObtained = finalAmount?.toFixed(2);

  const formInfoItems = [
    {
      label: " ITHIL obtained:",
      value: ithilObtained,
      isLoading: isInfoLoading,
    },
    {
      label: "redeem price:",
      value: redeemPrice,
      prefix: "$",
      isLoading: isInfoLoading,
    },
    {
      label: "maturity date:",
      value: maturityDate,
    },
  ];

  const {
    query: { asset: token },
  } = useRouter();

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
          <FormLabel marginTop={4}>{`Lock time in ${
            process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "months" : "minutes"
          }`}</FormLabel>
          <Box margin="10px 10px 50px">
            <Slider value={month} min={min} max={12} onChange={setMonth} />
          </Box>
          <FormInfo items={formInfoItems} />

          <AdvanceSection
            isAdvancedOptionsOpen={isAdvancedOptionsOpen}
            setIsAdvancedOptionsOpen={setIsAdvancedOptionsOpen}
            setSlippage={setSlippage}
            slippage={slippage}
          />
        </Box>
      </div>
      {inputAmount !== "" && (
        <ServiceError isFinalAmountIsNegative={finalAmount.isNegative()} />
      )}
      <PrivateButton
        onClick={() => (isApproved ? onOpen() : approve?.())}
        isDisabled={isButtonDisabled}
        loadingText="Waiting"
        isLoading={isButtonLoading}
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Invest"
          : `Approve ${asset.label}`}
      </PrivateButton>

      <PositionModal
        isOpen={isOpen}
        canShowSlippageSlider={false}
        canShowPercentageSlider={false}
        onClose={onClose}
        data={{
          amount: inputAmount,
          assetLabel: getAssetByName(getSingleQueryParam(token)).label,
          assetName: getSingleQueryParam(token),
          ithilObtained: ithilObtained.toString(),
          maturityDate,
          position: "call-option",
          redeemPrice,
          type: "open",
        }}
        title="Open Position"
        submitText="Invest"
        onSubmit={openPosition}
      />
    </div>
  );
};

export default Form;
