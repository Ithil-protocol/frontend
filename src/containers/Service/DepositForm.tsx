import {
  Box,
  Button,
  InputGroup,
  NumberInput,
  NumberInputField,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useState } from "react";

import { CloseButtonWithCircle } from "@/assets/svgs";
import { getDecimalRegex } from "@/data/regex";
import { useBaseApy } from "@/hooks/useBaseApy";
import { palette } from "@/styles/theme/palette";
import { AaveAsset } from "@/types/onchain.types";
import { mode, pickColor } from "@/utils/theme";

import AdvancedFormLabel from "./AdvancedFormLabel";
import FormDescriptionItem from "./FormDescriptionItem";

interface Props {
  leverage: string;
  slippage: string;
  setLeverage: Dispatch<SetStateAction<string>>;
  setSlippage: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  interestAndSpreadInPercent: number;
  assetDecimal?: AaveAsset["decimals"];
}

const DepositForm: FC<Props> = ({
  assetDecimal = 6,
  interestAndSpreadInPercent,
  isLoading,
  leverage,
  setLeverage,
  setSlippage,
  slippage,
}) => {
  const { colorMode } = useColorMode();
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const {
    query: { asset },
  } = useRouter();

  const { baseApy, isLoading: apyLoading } = useBaseApy(asset as string);
  const finalLeverage = isAdvancedOptionsOpen ? leverage : 1.5;
  const finalApy = baseApy
    ? (+baseApy * +finalLeverage - interestAndSpreadInPercent).toFixed(2)
    : "";

  const handleAdvancedOptionClick = (condition: boolean) => () => {
    setIsAdvancedOptionsOpen(condition);
  };

  return (
    <Box width="full" gap="30px">
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
          rightPart={baseApy?.toFixed(2)}
          isLoading={apyLoading}
        />
        <FormDescriptionItem
          extension="x"
          leftPart="Best Leverage:"
          rightPart={finalLeverage}
        />
        <FormDescriptionItem
          extension="%"
          leftPart="Borrow Interest:"
          rightPart={interestAndSpreadInPercent}
          isLoading={isLoading}
        />
        <FormDescriptionItem
          extension="%"
          leftPart="Final APY:"
          rightPart={finalApy}
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
          //TODO:
          <>
            <AdvancedFormLabel label="Leverage" tooltip="Leverage" />
            <InputGroup size="md">
              <NumberInput
                width="100%"
                value={leverage}
                onChange={(value) => {
                  if (getDecimalRegex(assetDecimal).test(value) || value === "")
                    setLeverage(value);
                }}
                step={0.01}
                precision={2}
                min={1.01}
                variant="filled"
              >
                <NumberInputField />
              </NumberInput>
            </InputGroup>

            <AdvancedFormLabel label="Slippage" tooltip="Not implemented" />
            <InputGroup size="md">
              <NumberInput
                width="100%"
                step={0.1}
                value={slippage}
                onChange={(value) => {
                  if (getDecimalRegex(assetDecimal).test(value) || value === "")
                    setSlippage(value);
                }}
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
