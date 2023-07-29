import { Box, Button, HStack, Td, Text, Tr } from "@chakra-ui/react";
import { FC } from "react";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useContractWrite } from "wagmi";

import { aaveABI, gmxABI } from "@/abi";
import TokenIcon from "@/components/TokenIcon";
import { Loading } from "@/components/loading";
import { aaveAddress } from "@/hooks/generated/aave";
import { gmxAddress } from "@/hooks/generated/gmx";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { useColorMode } from "@/hooks/useColorMode";
import { useIsMounted } from "@/hooks/useIsMounted";
import { queryClient } from "@/lib/react-query";
import { palette } from "@/styles/theme/palette";
import { TRowTypes } from "@/types";
import { getAssetByAddress } from "@/utils";

interface Data extends Omit<TRowTypes, "createdAt"> {
  pnlPercentage: string | undefined;
  pnl: string | undefined;
  id: bigint | undefined;
  quote: bigint | undefined;
  formattedPnl: string;
  type: string;
}

interface Props {
  data: Data;
}

const ActiveTRow: FC<Props> = ({ data }) => {
  const { colorMode, mode, pickColor } = useColorMode();

  const { trackTransaction } = useTransactionFeedback();

  const services = {
    AAVE: {
      abi: aaveABI,
      address: aaveAddress[98745],
    },
    GMX: {
      abi: gmxABI,
      address: gmxAddress[98745],
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
    console.log("data.quote", data.quote);
    if (
      data.id === undefined ||
      data.amount === undefined ||
      data.quote === undefined
    )
      return;
    const result = await close({
      args: [
        data.id,
        encodeAbiParameters(parseAbiParameters("uint256"), [
          (data.quote * 999n) / 1000n,
          // 0n,
        ]),
      ],
    });
    await trackTransaction(result, "Position closed");
    queryClient.resetQueries();
  };
  const asset = getAssetByAddress(data.token);

  if (!isMounted) return null;

  const isPnlPositive = data.pnl ? +data.pnl >= 0 : true;

  return (
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
        {data.type}
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
  );
};

export default ActiveTRow;
