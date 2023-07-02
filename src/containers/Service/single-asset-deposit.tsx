import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { type FC, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import TokenIcon from "@/components/TokenIcon";
import TokenModal from "@/components/TokenModal";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { serviceABI, serviceAddress } from "@/hooks/generated/service";
import { useToken } from "@/hooks/use-token.hook";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { type AaveAsset } from "@/types/onchain.types";
import {
  abbreviateBigNumber,
  stringInputToBigNumber,
} from "@/utils/input.utils";

import { prepareOrder } from "../Services/service.contract";
import DepositForm from "./DepositForm";

interface WidgetSingleAssetDepositProps {
  // data
  asset?: AaveAsset;
  balance?: bigint;

  // actions
  inputAmount: string;
  onInputChange: (amount: string) => void;
  onActionClick: () => void;
  onMaxClick: () => void;

  // status
  isConnected: boolean;
  isBalanceLoading: boolean;
  isButtonDisabled: boolean;
  isButtonLoading: boolean;
  isMaxDisabled: boolean;
  isApproved: boolean;
}

export const WidgetSingleAssetDeposit: FC<WidgetSingleAssetDepositProps> = ({
  asset,
  balance,
  inputAmount,
  isApproved,
  isBalanceLoading,
  isButtonDisabled,
  isButtonLoading,
  isConnected,
  isMaxDisabled,
  onActionClick,
  onInputChange,
  onMaxClick,
}) => {
  const { openConnectModal } = useConnectModal();
  const { isOpen, onOpen, onClose } = useDisclosure({});
  const router = useRouter();

  const handleSelectToken = (tokenName: string) => {
    onClose();
    const serviceName = history.state.as.split("/").at(-2);
    if (serviceName) {
      router.push(`/services/${serviceName}/${tokenName}`);
    } else {
      console.error("INVALID_SERVICE_NAME:", serviceName);
      console.debug("history state:", history.state);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-primary-100 rounded-xl">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">Deposit</Text>
        <div className="flex flex-row items-center justify-end gap-2">
          {isBalanceLoading ? (
            <Loading />
          ) : (
            <>
              <Text textStyle="slender-sm2">
                {abbreviateBigNumber(balance, asset!.decimals)}
              </Text>
              <Text textStyle="slender-sm2">
                (<EstimatedValue value={balance} token={asset!} />)
              </Text>
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
        <div className="flex  gap-2">
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={onOpen}
            className="flex items-center gap-1 justify-center px-2 rounded-md bg-primary-200 min-w-[92px]"
          >
            {asset == null ? (
              <Loading />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>
                  <TokenIcon
                    className="w-6 h-6"
                    name={asset.iconName}
                    height={24}
                    width={24}
                  />
                </span>
                <Text textStyle="sm">{asset.name}</Text>
              </div>
            )}
          </div>

          <InputGroup size="md">
            <Input
              type="number"
              step="0.1"
              variant="filled"
              value={inputAmount}
              onChange={(event) => onInputChange(event.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={onMaxClick}
                isDisabled={isMaxDisabled}
                variant="insideInput"
              >
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
        </div>

        <DepositForm />
      </div>

      {isConnected ? (
        <Button
          mt="20px"
          onClick={() => {
            void onActionClick();
          }}
          isDisabled={isButtonDisabled}
          isLoading={isButtonLoading}
          loadingText={isButtonLoading ? "Waiting" : undefined}
        >
          {asset == null
            ? "Loading..."
            : isApproved
            ? "Open position"
            : `Approve ${asset.name}`}
        </Button>
      ) : (
        <Button mt="20px" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}

      <TokenModal
        onSelectToken={handleSelectToken}
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
};

interface ServiceDepositProps {
  asset: AaveAsset;
}

export const ServiceDeposit: FC<ServiceDepositProps> = ({ asset }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() as 42161;
  const [inputAmount, setInputAmount] = useState<string>("0");
  const inputBigNumber = stringInputToBigNumber(inputAmount, asset.decimals);

  // web3 hooks
  const { trackTransaction, reportException } = useTransactionFeedback();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: asset.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const { useAllowance, useApprove } = useToken(asset.tokenAddress);
  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    address,
    serviceAddress[chainId]
  );
  const {
    data: approveData,
    isLoading: isApproveLoading,
    writeAsync: approve,
  } = useApprove(serviceAddress[chainId], inputBigNumber);
  const { isLoading: isApproveWaiting } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  const order = prepareOrder(
    asset.tokenAddress,
    asset.aTokenAddress,
    inputBigNumber,
    2
  );
  // serviceTest(order);
  console.log(order);
  // const {
  //   config: openConfig,
  //   isLoading: isOpenPrepareLoading,
  //   isError: isOpenPrepareError,
  //   error: openPrepareError,
  // } = usePrepareServiceOpen({ args: [order] });
  const isOpenPrepareLoading = false;
  const isOpenPrepareError = false;
  const openPrepareError: Error = {
    name: "a",
    message: "openPrepareError message",
  };
  const {
    data: openData,
    isLoading: isOpenLoading,
    writeAsync: open,
  } = useContractWrite({
    abi: serviceABI,
    address: serviceAddress[42161],
    functionName: "open",
    args: [order],
  });
  const { isLoading: isOpenWaiting } = useWaitForTransaction({
    hash: openData?.hash,
  });

  // computed properties
  const isApproved = allowance ? allowance >= inputBigNumber : false;
  const isButtonLoading =
    isApproveLoading ||
    isApproveWaiting ||
    isOpenLoading ||
    isOpenWaiting ||
    isOpenPrepareLoading;
  const isInconsistent = inputBigNumber > (balance?.value ?? 0);
  const isButtonDisabled =
    isButtonLoading || isInconsistent || inputBigNumber === BigInt(0);
  const isMaxDisabled = inputBigNumber === (balance?.value ?? 0);

  const onInputChange = (amount: string) => {
    setInputAmount(amount);
  };
  const onActionClick = async () => {
    if (!isApproved) {
      const result = await approve?.();
      await trackTransaction(result, `Approve ${inputAmount} ${asset.name}`);
      await refetchAllowance();
      return;
    }

    if (isOpenPrepareError) return reportException(openPrepareError);

    const result = await open?.();
    await trackTransaction(result, `Deposit ${inputAmount} ${asset.name}`);
    await refetchAllowance();
    setInputAmount("0");
  };
  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "0");
  };

  return (
    <WidgetSingleAssetDeposit
      inputAmount={inputAmount}
      balance={balance?.value ?? BigInt(0)}
      onInputChange={onInputChange}
      onActionClick={onActionClick}
      onMaxClick={onMaxClick}
      isConnected={isConnected}
      isBalanceLoading={isBalanceLoading}
      isButtonDisabled={isButtonDisabled}
      isButtonLoading={isButtonLoading}
      isMaxDisabled={isMaxDisabled}
      isApproved={isApproved}
      asset={asset}
    />
  );
};

export const DynamicServiceDeposit = dynamic(
  async () =>
    await import("@/containers/Service/single-asset-deposit").then(
      (mod) => mod.ServiceDeposit
    ),
  {
    ssr: false,
    loading: () => (
      <WidgetSingleAssetDeposit
        inputAmount="0"
        onInputChange={() => console.log}
        onActionClick={() => console.log}
        onMaxClick={() => console.log}
        isConnected={false}
        isBalanceLoading={true}
        isButtonDisabled={true}
        isButtonLoading={false}
        isMaxDisabled={false}
        isApproved={false}
      />
    ),
  }
);
