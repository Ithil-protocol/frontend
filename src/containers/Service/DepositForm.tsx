import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

import { CloseButtonWithCircle } from "@/assets/svgs";
import { useChartAave } from "@/hooks/defillama";
import { palette } from "@/styles/theme/palette";
import { mode, pickColor } from "@/utils/theme";

import AdvancedFormLabel from "./AdvancedFormLabel";
import FormDescriptionItem from "./FormDescriptionItem";

const DepositForm = () => {
  const { colorMode } = useColorMode();
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const {
    query: { asset },
  } = useRouter();

  const { data, isLoading } = useChartAave(asset as string);
  const [leverage, setLeverage] = useState("1.5");

  const baseApy = data?.[data?.length - 1].apy.toFixed(4);

  const finalLeverage = isAdvancedOptionsOpen ? leverage : 1.5;

  const finalApy = baseApy ? (+baseApy * +finalLeverage).toFixed(4) : "";

  const handleAdvancedOptionClick = (condition: boolean) => () => {
    setIsAdvancedOptionsOpen(condition);
  };

  return (
    <Box width="full" gap="30px">
      {/* <Box
        mt="32px"
        style={{ borderRadius: "10px", border: "1px solid transparent" }}
        bg={mode(colorMode, "primary.200", "primary.200.dark")}
      >
        <FormDescriptionItem
          leftPart="Total Margin:"
          rightPart="1000"
          extension="$"
        />

        <FormDescriptionItem
          extension="$"
          leftPart="Price Impact:"
          rightPart="1"
        />
      </Box> */}

      <Box
        marginTop={5}
        bg={mode(colorMode, "primary.100", "primary.100.dark")}
        borderRadius="5px"
        border={`2px dashed ${pickColor(
          colorMode,
          palette.colors.primary,
          "400"
        )}`}
      >
        <FormDescriptionItem
          extension="%"
          leftPart="Base APY:"
          rightPart={baseApy}
          isLoading={isLoading}
        />
        <FormDescriptionItem
          extension="x"
          leftPart="Best Leverage:"
          rightPart={finalLeverage}
        />
        <FormDescriptionItem
          extension="%"
          leftPart="Borrow Interest:"
          rightPart="0"
        />
        <FormDescriptionItem
          extension="%"
          leftPart="Final APY:"
          rightPart={finalApy}
          isLoading={isLoading}
        />
      </Box>

      <Box gap={5} display="flex" flexDirection="column" marginTop={5}>
        {isAdvancedOptionsOpen ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Advanced Options</span>
            <span
              onClick={handleAdvancedOptionClick(false)}
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
            >
              <CloseButtonWithCircle />
            </span>
          </div>
        ) : (
          <Button
            style={{
              padding: "10px",
            }}
            onClick={handleAdvancedOptionClick(true)}
            color={mode(colorMode, "primary.100.dark", "primary.100")}
            bg={mode(colorMode, "primary.400", "primary.500.dark")}
          >
            <span
              style={{
                fontSize: "16px",
                padding: "5px",
                fontWeight: "700",
                lineHeight: "27.63px",
              }}
            >
              +
            </span>
            <span>Advanced Option</span>
          </Button>
        )}

        {isAdvancedOptionsOpen && (
          <>
            <AdvancedFormLabel label="Leverage" tooltip="Leverage" />
            <InputGroup size="md">
              <NumberInput
                width="100%"
                value={leverage}
                onChange={setLeverage}
                step={0.01}
                precision={2}
                min={1.01}
                variant="filled"
              >
                <NumberInputField />
              </NumberInput>
              <InputRightElement>%</InputRightElement>
            </InputGroup>

            <AdvancedFormLabel label="Slippage" tooltip="Not implemented" />
            <InputGroup size="md">
              <NumberInput
                width="100%"
                step={0.1}
                precision={1}
                min={0.1}
                defaultValue={0.1}
                variant="filled"
              >
                <NumberInputField />
              </NumberInput>
            </InputGroup>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DepositForm;
