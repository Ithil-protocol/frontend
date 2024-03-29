import { HStack, Text, useDisclosure } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Address, formatUnits } from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";

import { fixedYieldABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { PositionModal } from "@/contexts/PositionModal";
import { fixedYieldAddress } from "@/hooks/generated/fixedYield";
import { useAllowance } from "@/hooks/useAllowance";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePrepareFixedYieldOrder } from "@/hooks/usePrepareOrder";
import { Asset } from "@/types";
import { getAssetByName, getSingleQueryParam } from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

// import AdvancedFormLabel from "./AdvancedFormLabel";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

const Form = ({ asset }: { asset: Asset }) => {
  const { address: accountAddress } = useAccount();
  const [inputAmount, setInputAmount] = useState("");
  const notificationDialog = useNotificationDialog();
  const { isOpen, onClose, onOpen } = useDisclosure();

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
    spender: fixedYieldAddress,
    token: asset,
  });

  const { order, isLoading } = usePrepareFixedYieldOrder({
    asset,
    amount: inputAmount,
  });

  const { write: openPosition } = useContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
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
        setInputAmount("");
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError("Failed", error),
  });

  // computed properties
  const isButtonLoading = isLoading || isAllowanceRefetching;
  const isButtonDisabled = +inputAmount === 0;
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const isMounted = useIsMounted();

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
      </div>

      <PrivateButton
        onClick={() => (isApproved ? onOpen() : approve?.())}
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

      <PositionModal
        canShowSlippageSlider={false}
        canShowPercentageSlider={false}
        data={{
          amount: inputAmount,
          position: "fixed-yield",
          assetName: getSingleQueryParam(token),
          assetLabel: getAssetByName(getSingleQueryParam(token))?.label,
          collateral: formatUnits(
            order.agreement.collaterals[0].amount,
            asset.decimals
          ),
        }}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={openPosition}
        submitText="Invest"
        title="Open Position"
      />
    </div>
  );
};

export default Form;
