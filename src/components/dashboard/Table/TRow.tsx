import {
  Box,
  Button,
  Center,
  HStack,
  Stack,
  Td,
  Text,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";

import TokenIcon from "@/components/TokenIcon";
import { palette } from "@/styles/theme/palette";
import { mode, pickColor } from "@/utils/theme";

interface TRowProps {
  data: any;
}

const TRow: FC<TRowProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const handelCancelBtn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
  };
  return (
    <Tr
      width="full"
      bgColor={pickColor(colorMode, palette.colors.primary, "100")}
      borderRadius="12px"
      onClick={() => router.push("/dashboard/detail/1")}
      cursor="pointer"
      sx={{
        "& > td": {
          padding: ["20px 40px", "30px 40px"],
        },
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
                  <TokenIcon name="USDT" />
                </Box>
                <Box
                  position="absolute"
                  left="15px"
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
                    name="DAI"
                  />
                </Box>
              </Box>
              <Text fontSize="22px" lineHeight="22px">
                ETH / BNB
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
        ETH - 2x Long
      </Td>
      <Td>
        <HStack>
          <Text
            fontWeight="medium"
            color="#15ac89"
            fontSize="22px"
            lineHeight="22px"
          >
            $ 1200
          </Text>
          <Text
            bg="#15ac89"
            borderRadius="8px"
            fontWeight="bold"
            fontFamily="18px"
            lineHeight="24px"
            textColor={mode(colorMode, "primary.100", "primary.100.dark")}
            paddingX="8px"
            paddingY="4px"
            fontSize="18px"
          >
            + 12 %
          </Text>
        </HStack>
      </Td>
      <Td textAlign="end">
        <Button onClick={handelCancelBtn} variant="outline" color="#f35959">
          Cancel
        </Button>
      </Td>
    </Tr>
  );
};

export default TRow;
