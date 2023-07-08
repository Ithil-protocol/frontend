import { Box, HStack, Td, Text, Tr, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

import TokenIcon from "@/components/TokenIcon";
import { palette } from "@/styles/theme/palette";
import { TRowTypes, VaultName } from "@/types";
import { formatToken, getVaultByTokenAddress } from "@/utils";
import { formatFullDate } from "@/utils/date.utils";
import { mode, pickColor } from "@/utils/theme";

interface Props {
  data: TRowTypes;
}

const TRowOther: FC<Props> = ({ data }) => {
  const { colorMode } = useColorMode();
  const vaultTokenData = getVaultByTokenAddress(data.token);

  return (
    <Tr
      width="full"
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
                    name={vaultTokenData?.iconName || ""}
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
        {vaultTokenData?.name} -{" "}
        {formatToken(
          vaultTokenData?.name as VaultName,
          data.amount / data.margin
        )}
      </Td>
      <Td>
        <Text
          fontWeight="medium"
          color={mode(colorMode, "primary.700", "primary.700.dark")}
          fontSize="22px"
          lineHeight="22px"
        >
          {formatFullDate(new Date(Number(data.createdAt) * 1000))}
        </Text>
      </Td>
      <Td textAlign="end" width={200} height="108px"></Td>
    </Tr>
  );
};

export default TRowOther;
