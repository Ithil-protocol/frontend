import {
  Box,
  Button,
  Center,
  HStack,
  Td,
  Text,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";

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
      onClick={() => router.push("/")}
      cursor="pointer"
      sx={{
        "& > td": {
          padding: "40px",
          margin: "12px",
        },
      }}
    >
      <Td
        color={mode(colorMode, "primary.main.dark", "primary.main")}
        fontSize="22px"
        lineHeight="22px"
      >
        <Box></Box>
        <Text>ETH / BNB</Text>
      </Td>
      <Td
        color={mode(colorMode, "primary.700", "primary.700.dark")}
        fontWeight="medium"
        fontSize="22px"
        lineHeight="22px"
      >
        ETH - 2x Long
      </Td>
      <Td gap="10px">
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
