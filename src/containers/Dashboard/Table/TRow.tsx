import {
  Box,
  Button,
  HStack,
  Td,
  Text,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC } from "react";
import { Address, encodeAbiParameters, parseAbiParameters } from "viem";
import { useContractWrite } from "wagmi";

import TokenIcon from "@/components/TokenIcon";
import { Loading } from "@/components/loading";
import { serviceABI, serviceAddress } from "@/hooks/generated/service";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { useIsMounted } from "@/hooks/useIsMounted";
import { palette } from "@/styles/theme/palette";
import { TRowTypes } from "@/types";
import { getVaultByTokenAddress } from "@/utils";
import { mode, pickColor } from "@/utils/theme";

interface Data extends Omit<TRowTypes, "createdAt"> {
  pnlPercentage: string | undefined;
  pnl: string | undefined;
  id: bigint | undefined;
}

interface TRowProps {
  data: Data;
}

const TRow: FC<TRowProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const { name } = getVaultByTokenAddress(data.token);

  const { trackTransaction, reportException } = useTransactionFeedback();

  const {
    writeAsync: close,
    isLoading,
    reset,
  } = useContractWrite({
    address: serviceAddress[42161] as Address,
    abi: serviceABI,
    functionName: "close",
    gas: 20000000n,
  });

  const queryClient = useQueryClient();

  const isMounted = useIsMounted();
  const handelCancelBtn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (!data.id || !data.amount) return;
    const result = await close({
      args: [
        data.id,
        encodeAbiParameters(parseAbiParameters("uint256"), [
          (data.amount * 999n) / 1000n,
        ]),
      ],
    });
    await trackTransaction(result, "Position closed");
    queryClient.clear();
  };
  const vaultTokenData = getVaultByTokenAddress(data.token);

  if (!isMounted) return null;

  const isPnlPositive = data.pnl ? +data.pnl >= 0 : true;

  return (
    <Tr
      width="48"
      bgColor={pickColor(colorMode, palette.colors.primary, "100")}
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
      <Td color={mode(colorMode, "primary.main.dark", "primary.main")}>
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
                    name={vaultTokenData?.name || ""}
                  />
                </Box>
              </Box>
              <Text fontSize="22px" lineHeight="22px">
                {vaultTokenData?.name}
              </Text>
            </HStack>
          </Box>
        </HStack>
      </Td>
      <Td
        color={mode(colorMode, "primary.700", "primary.700.dark")}
        fontWeight="medium"
        fontSize="22px"
        lineHeight="22px"
      >
        Aave
      </Td>
      <Td>
        {data.pnl !== undefined ? (
          <HStack>
            <Text
              fontWeight="medium"
              color={isPnlPositive ? "#15ac89" : "#f35959"}
              fontSize="22px"
              lineHeight="22px"
            >
              $ {data.pnl}
            </Text>
            <Text
              bg={isPnlPositive ? "#15ac89" : "#f35959"}
              borderRadius="8px"
              fontWeight="bold"
              fontFamily="18px"
              lineHeight="24px"
              textColor={mode(colorMode, "primary.100", "primary.100.dark")}
              paddingX="8px"
              paddingY="4px"
              fontSize="18px"
            >
              {data.pnlPercentage} %
            </Text>
          </HStack>
        ) : (
          <Loading />
        )}
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
  );
};

export default TRow;
