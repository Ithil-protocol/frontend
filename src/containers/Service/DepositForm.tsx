import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";

import { CloseButtonWithCircle } from "@/assets/svgs";
import { palette } from "@/styles/theme/palette";
import { mode, pickColor } from "@/utils/theme";

import AdvancedFormLabel from "./AdvancedFormLabel";
import FormDescriptionItem from "./FormDescriptionItem";

const DepositForm = () => {
  const { colorMode } = useColorMode();
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const handleAdvancedOptionClick = (condition: boolean) => () => {
    setIsAdvancedOptionsOpen(condition);
  };

  return (
    <Box
      style={{
        display: "flex",
        gap: "30px",
        flexDirection: "column",
        maxWidth: "449px",
      }}
    >
      <Box
        mt={"32px"}
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
      </Box>

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
          extension="x"
          leftPart="Best Leverage:"
          rightPart="5"
        />
        <FormDescriptionItem
          extension="%"
          leftPart="Base APY:"
          rightPart="2.5"
        />
        <FormDescriptionItem
          extension="%"
          leftPart="Final APY:"
          rightPart="12.5"
        />
        <FormDescriptionItem
          extension="%"
          leftPart="Borrow Interest:"
          rightPart="2"
        />
      </Box>

      <Box gap={5} display={"flex"} flexDirection={"column"} marginTop={5}>
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
            <AdvancedFormLabel label="Slippage" tooltip="Not implemented" />
            <InputGroup size="md">
              <Input type="number" step="0.1" variant="filled" />
              <InputRightElement>%</InputRightElement>
            </InputGroup>

            <AdvancedFormLabel label="Deadline" tooltip="Not implemented" />

            <InputGroup size="md">
              <Input type="number" step="0.1" variant="filled" />
              <InputRightElement width="4.5rem">
                <Button isDisabled h="1.75rem" size="sm" variant="insideInput">
                  Min
                </Button>
              </InputRightElement>
            </InputGroup>

            {/* <Button
              bg={pickColor(colorMode, palette.variants.primary, "success")}
            >
              Open
            </Button> */}
          </>
        )}
      </Box>
    </Box>
  );
};

export default DepositForm;
