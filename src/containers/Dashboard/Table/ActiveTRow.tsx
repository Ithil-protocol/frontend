import {
  Box,
  Button,
  HStack,
  Td,
  Text,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import Decimal from "decimal.js";
import { FC, useState } from "react";
import {
  Address,
  encodeAbiParameters,
  formatUnits,
  parseAbiParameters,
} from "viem";
import { useContractWrite, useQueryClient } from "wagmi";

import { aaveABI, callOptionABI, fixedYieldABI, gmxABI } from "@/abi";
import { Tooltip as TooltipIcon } from "@/assets/svgs";
import TokenIcon from "@/components/TokenIcon";
import { Loading } from "@/components/loading";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { PositionModal } from "@/contexts/PositionModal";
import { fixedYieldAddress } from "@/hooks/generated/fixedYield";
import { useGmxWethReward } from "@/hooks/generated/gmx";
import { useCallOptionInfo } from "@/hooks/useCallOptionInfo";
import { useColorMode } from "@/hooks/useColorMode";
import { useIsMounted } from "@/hooks/useIsMounted";
import { palette } from "@/styles/theme/palette";
import { PositionType } from "@/types";
import { cutoffDecimals, getAssetByAddress, isPositionActive } from "@/utils";

interface Props {
  data: PositionType;
}

const ActiveTRow: FC<Props> = ({ data }) => {
  const { colorMode, mode, pickColor } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [percentage, setPercentage] = useState(100);
  const [slippage, setSlippage] = useState(1);
  const asset = getAssetByAddress(data.token as Address);

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
      address: "0x" as Address,
    },
    gmx: {
      abi: gmxABI,
      address: "0x" as Address,
    },
    "fixed-yield": {
      abi: fixedYieldABI,
      address: fixedYieldAddress,
    },
    "call-option": {
      abi: callOptionABI,
      address: getAssetByAddress(data.token)?.callOptionAddress,
    },
  } as const;

  const service = services[data.type as keyof typeof services];

  const { data: reward } = useGmxWethReward({
    args: [data.id!],
    enabled: !!data.id && data.type === "gmx",
  });

  const queryClient = useQueryClient();

  const { write: close } = useContractWrite({
    address:
      data.type === "aave" || data.type === "gmx"
        ? data.contractAddress
        : service?.address,
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

  const handelConfirmBtn = async () => {
    if (data.isPnlLoading) return;
    const initialQuote = data?.quote || 0n;
    const quotes: Record<string, bigint> = {
      aave: BigInt(
        new Decimal(initialQuote.toString())
          .mul(new Decimal(1 - slippage / 100))
          .floor()
          .toNumber()
      ),
      gmx: BigInt(
        new Decimal(initialQuote.toString())
          .mul(new Decimal(1 - slippage / 100))
          .floor()
          .toNumber()
      ),
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
  const isDebitService = data.type === "aave" || data.type === "gmx";

  const isMounted = useIsMounted();

  const isPnlPositive = data.pnl ? +data.pnl >= 0 : true;

  const { formattedPnl = "0" } = data;

  const pnlColor =
    +formattedPnl === 0 ? "#a4b1be" : isPnlPositive ? "#15ac89" : "#f35959";

  const handleCloseClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onOpen();
  };
  const isDebitServiceActive = isPositionActive(
    data.type,
    Number(data.createdAt)
  );
  if (!isMounted) return null;

  const amountObtained = Number(data.margin) + Number(data.pnl ?? 0);

  return (
    <>
      <Tr
        width="72"
        bgColor={pickColor(palette.colors.primary, "100")}
        borderRadius="12px"
        sx={{
          "& > td": {
            padding: ["20px 40px", "30px 40px"],
          },
          minWidth: "100px",
          minHeight: "200px",
        }}
      >
        <Td color={mode("primary.main.dark", "primary.main")}>
          <HStack spacing="20px" alignItems="center">
            <Box>
              <HStack>
                <Box position="relative" display="inline-block" mr="50px">
                  <Box
                    position="absolute"
                    left="0"
                    top="50%"
                    transform="translateY(-50%)"
                  >
                    <TokenIcon
                      style={{
                        border:
                          colorMode === "light"
                            ? "2.5px solid #f2f5f6"
                            : "2.5px solid #151a29",
                        borderRadius: "100%",
                      }}
                      width={42}
                      height={42}
                      name={asset?.name || ""}
                    />
                  </Box>
                </Box>
                <Text fontSize="22px" lineHeight="22px">
                  {asset?.label}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Td>
        <Td
          color={mode("primary.700", "primary.700.dark")}
          fontWeight="medium"
          fontSize="22px"
          lineHeight="22px"
        >
          {data.name}
        </Td>
        <Td>
          {!data.isPnlLoading ? (
            data?.formattedPnl && (
              <HStack>
                <Text
                  fontWeight="medium"
                  color={pnlColor}
                  fontSize="22px"
                  lineHeight="22px"
                >
                  {data.formattedPnl}
                </Text>
                <Text
                  bg={pnlColor}
                  borderRadius="8px"
                  fontWeight="bold"
                  fontFamily="18px"
                  lineHeight="24px"
                  textColor={mode("primary.100", "primary.100.dark")}
                  paddingX="8px"
                  paddingY="4px"
                  fontSize="18px"
                >
                  {data.pnlPercentage} %
                </Text>
              </HStack>
            )
          ) : (
            <Loading />
          )}
        </Td>
        <Td
          color={mode("primary.700", "primary.700.dark")}
          fontWeight="medium"
          fontSize="22px"
          lineHeight="22px"
        >
          <div className="flex items-center w-full h-full gap-1">
            {data.type === "call-option" ? data.amount : data.margin}
            <Text fontSize={"medium"} className="mt-1.5">
              {data.type !== "call-option" &&
                data.type !== "fixed-yield" &&
                `(x${cutoffDecimals(Number(data.leverage), 1)})`}
            </Text>
          </div>
        </Td>
        <Td
          color={
            !isDebitServiceActive
              ? mode("#B7791F", "yellow")
              : mode("primary.700", "primary.700.dark")
          }
          fontWeight="medium"
          fontSize="22px"
          lineHeight="22px"
        >
          {isDebitService &&
            (!isDebitServiceActive ? (
              <>
                <Tooltip
                  label={
                    "Your position should be closed as it has surpassed the service threshold"
                  }
                  closeDelay={500}
                >
                  <Text>
                    Expired{" "}
                    <TooltipIcon
                      width={20}
                      height={20}
                      style={{
                        display: "inline",
                        cursor: "help",
                      }}
                    />
                  </Text>
                </Tooltip>
              </>
            ) : (
              "Active"
            ))}
        </Td>
        <Td textAlign="end" width={200} height="108px">
          <Button onClick={handleCloseClick} variant="outline" color="#f35959">
            Close
          </Button>
        </Td>
      </Tr>

      <PositionModal
        canShowPercentageSlider={data.type === "call-option"}
        canShowSlippageSlider
        isOpen={isOpen}
        onClose={onClose}
        data={{
          type: "close",
          assetName: asset?.name,
          assetLabel: asset?.label,
          position: data.type,
          leverage: data.leverage,
          slippage: slippage.toString(),
          amountObtained: amountObtained.toFixed(2),
          wethReward:
            data.type === "gmx" && reward !== undefined && asset
              ? cutoffDecimals(+formatUnits(reward, 18), 6).toString()
              : undefined,
          purchasePrice:
            data.type === "call-option" ? redeem?.toFixed(2) : undefined,
          pnlPercentage: data.pnlPercentage,
          formattedPnl: data.formattedPnl,
          pnlColor,
          ithilPercentage:
            data.type === "call-option"
              ? (
                  (Number(data.callOptionCollateralAmount) * percentage) /
                  100
                ).toFixed(4)
              : undefined,
          sliderPercentage: percentage,
          notionalPercentage:
            data.type === "call-option"
              ? ((Number(data.amount) * (100 - percentage)) / 100).toString()
              : undefined,
          serviceName: data.type,
        }}
        title="Close Position"
        onPurchasePriceChange={setPercentage}
        onSlippageChange={setSlippage}
        submitText="Close Position"
        onSubmit={handelConfirmBtn}
      />
    </>
  );
};

export default ActiveTRow;
