import {
  Button,
  Modal as ChakraModal,
  CloseButton,
  Divider,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { FC, useState } from "react";
import { Address, encodeAbiParameters, parseAbiParameters } from "viem";
import { useContractWrite, useQueryClient } from "wagmi";

import { aaveABI, callOptionABI, fixedYieldABI, gmxABI } from "@/abi";
import Slider from "@/components/Slider";
import TokenIcon from "@/components/TokenIcon";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { aaveAddress } from "@/hooks/generated/aave";
import { fixedYieldAddress } from "@/hooks/generated/fixedYield";
import { gmxAddress } from "@/hooks/generated/gmx";
import { useCallOptionInfo } from "@/hooks/useCallOptionInfo";
import { useColorMode } from "@/hooks/useColorMode";
import { PositionType, VoidNoArgs } from "@/types";
import { getAssetByAddress } from "@/utils";

import ModalItem from "./ModalItem";

interface Props {
  data: Omit<
    PositionType,
    "createdAt" | "pnlPercentage" | "pnl" | "formattedPnl"
  >;
  isOpen: boolean;
  onOpen: VoidNoArgs;
  onClose: VoidNoArgs;
}

const Modal: FC<Props> = ({ data, isOpen, onClose }) => {
  const { mode } = useColorMode();

  const [percentage, setPercentage] = useState(100);

  const asset = getAssetByAddress(data.token as Address);
  const tokenName = asset?.name;

  const notificationDialog = useNotificationDialog();

  const { redeem } = useCallOptionInfo({
    asset: asset!,
    amount: data.amount?.toString(),
    month: 1,
    enabled: data.type === "call-option",
  });

  const services = {
    aave: {
      abi: aaveABI,
      address: aaveAddress[98745],
    },
    gmx: {
      abi: gmxABI,
      address: gmxAddress[98745],
    },
    "fixed-yield": {
      abi: fixedYieldABI,
      address: fixedYieldAddress[98745],
    },
    "call-option": {
      abi: callOptionABI,
      address: getAssetByAddress(data.token)?.callOptionAddress,
    },
  } as const;

  const service = services[data.type as keyof typeof services];

  const queryClient = useQueryClient();

  const { write: close } = useContractWrite({
    address: service?.address,
    abi: service?.abi as any,
    functionName: "close",
    onMutate: () => {
      notificationDialog.openLoading("Closing...");
    },
    onSuccess: async (result) => {
      try {
        await waitForTransaction(result);
        queryClient.resetQueries();
        onClose();
        notificationDialog.openSuccess("Position closed");
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => {
      notificationDialog.openError("Error happened", error);
    },
  });

  const handelConfirmBtn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (data.isPnlLoading) return;
    const initialQuote = data?.quote || 0n;
    const quotes: Record<string, bigint> = {
      aave: (initialQuote * 999n) / 1000n,
      gmx: (initialQuote * 9n) / 10n,
      "call-option":
        (BigInt(10) ** BigInt(18) * BigInt(percentage)) / BigInt(100),
    };
    const quote = quotes[data?.type] || 0n;
    close({
      args: [
        data.id,
        encodeAbiParameters(parseAbiParameters("uint256"), [quote]),
      ],
    });
  };
  return (
    <ChakraModal onClose={onClose} isCentered isOpen={isOpen}>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        display="flex"
        flexDirection="column"
        gap="10px"
        bg={mode("primary.100", "primary.100.dark")}
      >
        <ModalHeader
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Close position</span>
          <Text
            style={{
              cursor: "pointer",
              borderRadius: "8px",
              padding: "1px",
            }}
            onClick={() => onClose()}
          >
            <CloseButton width={7} height={7} />
          </Text>
        </ModalHeader>

        <Divider
          style={{
            width: "95%",
            alignSelf: "center",
          }}
        />

        <ModalBody marginBottom={8}>
          <VStack spacing="25px" marginTop={4} alignItems="start">
            <ModalItem title="Service name" value={`${data.name} service`} />
            <HStack alignItems="center">
              <ModalItem title="Amount obtained" value={data.amount} />{" "}
              {tokenName && (
                <TokenIcon name={tokenName} width={20} height={20} />
              )}
            </HStack>
            <ModalItem title="Slippage" value={`${data.slippage}%`} />

            {data.type === "call-option" && (
              <>
                <ModalItem
                  title="Purchase price"
                  value={`$${redeem?.toFixed(2)}`}
                />
                <Slider
                  value={percentage}
                  max={100}
                  min={0}
                  onChange={setPercentage}
                  extension="%"
                />
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <HStack>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              color="#f35959"
              onClick={handelConfirmBtn}
            >
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
