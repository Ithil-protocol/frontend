import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";
import React, { type FC, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import Modal from "@/common/Modal";
import TokenIcon from "@/components/TokenIcon";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { serviceAddress, usePrepareServiceOpen } from "@/generated";
import { useToken } from "@/hooks/use-token.hook";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { VoidNoArgs } from "@/types";
import { type AaveAsset } from "@/types/onchain.types";
import {
  abbreviateBigNumber,
  stringInputToBigNumber,
} from "@/utils/input.utils";
import { mode } from "@/utils/theme";

import { prepareOrder } from "../Services/service.contract";
import DepositForm from "./DepositForm";

interface WidgetSingleAssetDepositProps {
  // data
  asset?: AaveAsset;
  balance?: BigNumber;

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
  onInputChange,
  onActionClick,
  onMaxClick,

  isConnected,
  isBalanceLoading,
  isButtonDisabled,
  isButtonLoading,
  isMaxDisabled,
  isApproved,
}) => {
  const { openConnectModal } = useConnectModal();
  const { isOpen, onOpen, onClose } = useDisclosure({});

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

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
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
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      )}

      <TokenModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

interface ServiceDepositProps {
  asset: AaveAsset;
}

export const ServiceDeposit: FC<ServiceDepositProps> = ({ asset }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() as 1337;
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
  const {
    config: openConfig,
    isLoading: isOpenPrepareLoading,
    isError: isOpenPrepareError,
    error: openPrepareError,
  } = usePrepareServiceOpen({ args: [order] });
  const {
    data: openData,
    isLoading: isOpenLoading,
    writeAsync: open,
  } = useContractWrite(openConfig);
  const { isLoading: isOpenWaiting } = useWaitForTransaction({
    hash: openData?.hash,
  });

  // computed properties
  const isApproved = allowance?.gte(inputBigNumber) ?? false;
  const isButtonLoading =
    isApproveLoading ||
    isApproveWaiting ||
    isOpenLoading ||
    isOpenWaiting ||
    isOpenPrepareLoading;
  const isInconsistent = inputBigNumber.gt(balance?.value ?? 0);
  const isButtonDisabled =
    isButtonLoading || isInconsistent || inputBigNumber.isZero();
  const isMaxDisabled = inputBigNumber.eq(balance?.value ?? 0);

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
      balance={balance?.value ?? BigNumber.from(0)}
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

interface TokenModalProps {
  onClose: VoidNoArgs;
  isOpen: boolean;
}
const TokenModal: React.FC<TokenModalProps> = ({ onClose, isOpen }) => {
  const { colorMode } = useColorMode();

  return (
    <Modal
      title="Select a token"
      isOpen={isOpen}
      onClose={onClose}
      bg={mode(colorMode, "primary.100", "primary.100.dark")}
      modalBody={
        <>
          <List bg="transparent">
            {[
              {
                title: "DAI",
                description: "DAI Stablecoin",
                tokenName: "dai",
              },
              {
                description: "USD Coin",
                tokenName: "usdc",
                title: "USDC",
              },
              {
                title: "LINK",
                description: "ChainLink Token",
                tokenName: "usdt",
              },
              {
                description: "Wrapped BTC",
                tokenName: "wbtc",
                title: "WBTC",
              },
              {
                title: "WETH",
                description: "Wrapped Ether",
                tokenName: "weth",
              },
            ].map((item, key) => (
              <React.Fragment key={key}>
                <ListItem>
                  <Button
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "15px",
                      padding: "30px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div>
                      <TokenIcon name={item.tokenName} />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        fontWeight={"medium"}
                        color={mode(
                          colorMode,
                          "secondary.100",
                          "secondary.100.dark"
                        )}
                      >
                        {item.title}
                      </Text>
                      <Text
                        fontWeight={"medium"}
                        fontSize={"md"}
                        color={mode(
                          colorMode,
                          "primary.400.dark",
                          "primary.400"
                        )}
                      >
                        {item.description}
                      </Text>
                    </div>
                  </Button>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </>
      }
    />
  );
};
