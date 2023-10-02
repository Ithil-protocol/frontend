import { Box, HStack, Td, Text, Tr } from "@chakra-ui/react";
import { FC } from "react";

import TokenIcon from "@/components/TokenIcon";
import { Loading } from "@/components/loading";
import { useColorMode } from "@/hooks/useColorMode";
import { useIsMounted } from "@/hooks/useIsMounted";
import { palette } from "@/styles/theme/palette";
import { PositionType } from "@/types";
import { getAssetByAddress } from "@/utils";
import { formatFullDate } from "@/utils/date.utils";

interface Props {
  data: Omit<
    PositionType,
    | "slippage"
    | "amount"
    | "name"
    | "id"
    | "expireAt"
    | "callOptionCollateralAmount"
    | "contractAddress"
  >;
}

const CloseTRow: FC<Props> = ({ data }) => {
  const { colorMode, mode, pickColor } = useColorMode();
  const asset = getAssetByAddress(data.token);
  const isMounted = useIsMounted();

  if (!isMounted) return null;

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
        minWidth: "400px",
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
        {data.type?.toUpperCase()}
      </Td>
      <Td>
        <Text
          fontWeight="medium"
          color={mode("primary.700", "primary.700.dark")}
          fontSize="22px"
          lineHeight="22px"
        >
          {data.createdAt ? (
            formatFullDate(new Date(Number(data.createdAt) * 1000))
          ) : (
            <Loading />
          )}
        </Text>
      </Td>
      <Td textAlign="end" width={800} height="108px"></Td>
    </Tr>
  );
};

export default CloseTRow;
