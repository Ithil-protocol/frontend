import {
  Box,
  Button,
  HStack,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { useContractWrite } from "wagmi";

import { aaveABI, callOptionABI, fixedYieldABI, gmxABI } from "@/abi";
import TokenIcon from "@/components/TokenIcon";
import { Loading } from "@/components/loading";
import { aaveAddress } from "@/hooks/generated/aave";
import { fixedYieldAddress } from "@/hooks/generated/fixedYield";
import { gmxAddress } from "@/hooks/generated/gmx";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { useColorMode } from "@/hooks/useColorMode";
import { useIsMounted } from "@/hooks/useIsMounted";
import { palette } from "@/styles/theme/palette";
import { TRowTypes, VaultName } from "@/types";
import { formatToken, getAssetByAddress } from "@/utils";

import Modal from "../Modal";

interface Data extends Omit<TRowTypes, "createdAt"> {
  pnlPercentage?: string;
  pnl?: string;
  isPnlLoading?: boolean;
  id?: bigint;
  quote?: bigint;
  formattedPnl?: string;
  type: string;
  name: string;
}

interface Props {
  data: Data;
}

const ActiveTRow: FC<Props> = ({ data }) => {
  const { colorMode, mode, pickColor } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { trackTransaction } = useTransactionFeedback();

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
  const { isLoading, writeAsync: close } = useContractWrite({
    address: service.address,
    abi: service.abi as any,
    functionName: "close",
  });

  // const queryClient = useQueryClient();

  const isMounted = useIsMounted();
  const handelCancelBtn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onOpen();
  };
  const asset = getAssetByAddress(data.token);

  if (!isMounted) return null;

  const isPnlPositive = data.pnl ? +data.pnl >= 0 : true;

  return (
    <>
      <Modal
        slider={4}
        data={{
          pnl: data.formattedPnl,
          amount: formatToken(
            getAssetByAddress(data.token)?.name as VaultName,
            data.amount
          ),
          margin: data.margin.toString(),
          service: data.name,
        }}
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
      />
      <Tr
        width="72"
        bgColor={pickColor(palette.colors.primary, "100")}
        borderRadius="12px"
        // onClick={() => router.push("/dashboard/detail/1")}
        // cursor="pointer"
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
                  {asset?.name}
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
                  color={isPnlPositive ? "#15ac89" : "#f35959"}
                  fontSize="22px"
                  lineHeight="22px"
                >
                  {data.formattedPnl}
                </Text>
                <Text
                  bg={isPnlPositive ? "#15ac89" : "#f35959"}
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
          {data.margin}
        </Td>
        <Td textAlign="end" width={200} height="108px">
          <Button
            onClick={handelCancelBtn}
            variant="outline"
            color="#f35959"
            isLoading={isLoading}
          >
            Close
          </Button>
        </Td>
      </Tr>
    </>
  );
};

export default ActiveTRow;
