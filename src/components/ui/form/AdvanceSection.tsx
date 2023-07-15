import {
  Box,
  Button,
  InputGroup,
  NumberInput,
  NumberInputField,
  useColorMode,
} from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

import { CloseButtonWithCircle } from "@/assets/svgs";
import { getDecimalRegex } from "@/data/regex";
import { AaveAsset } from "@/types/onchain.types";
import { mode } from "@/utils/theme";

import AdvancedFormLabel from "../../../containers/Service/AdvancedFormLabel";

interface Props {
  isAdvancedOptionsOpen: boolean;
  setIsAdvancedOptionsOpen: Dispatch<SetStateAction<boolean>>;
  leverage: string;
  setLeverage: Dispatch<SetStateAction<string>>;
  slippage: string;
  setSlippage: Dispatch<SetStateAction<string>>;
  asset: AaveAsset;
}

const AdvanceSection: FC<Props> = ({
  isAdvancedOptionsOpen,
  setIsAdvancedOptionsOpen,
  leverage,
  setLeverage,
  slippage,
  setSlippage,
  asset,
}) => {
  const { colorMode } = useColorMode();

  const handleAdvancedOptionClick = (condition: boolean) => () => {
    setIsAdvancedOptionsOpen(condition);
  };
  return (
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
              onChange={(value) => {
                if (getDecimalRegex(asset.decimals).test(value) || value === "")
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
                if (getDecimalRegex(asset.decimals).test(value) || value === "")
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
  );
};

export default AdvanceSection;
