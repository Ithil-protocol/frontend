import { Box, Button } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

import { CloseButtonWithCircle } from "@/assets/svgs";
import { useColorMode } from "@/hooks/useColorMode";

import LeverageInput from "./inputs/LeverageInput";
import SlippageInput from "./inputs/SlippageInput";

interface Props {
  isAdvancedOptionsOpen: boolean;
  setIsAdvancedOptionsOpen: Dispatch<SetStateAction<boolean>>;
  leverage?: string;
  setLeverage?: Dispatch<SetStateAction<string>>;
  slippage?: string;
  setSlippage?: Dispatch<SetStateAction<string>>;
}

const AdvanceSection: FC<Props> = ({
  isAdvancedOptionsOpen,
  setIsAdvancedOptionsOpen,
  leverage,
  setLeverage,
  slippage,
  setSlippage,
}) => {
  const { mode } = useColorMode();

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
          color={mode("primary.100.dark", "primary.100")}
          bg={mode("primary.400", "primary.500.dark")}
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
          {leverage && setLeverage && (
            <LeverageInput leverage={leverage} setLeverage={setLeverage} />
          )}
          {slippage && setSlippage && (
            <SlippageInput setSlippage={setSlippage} slippage={slippage} />
          )}
        </>
      )}
    </Box>
  );
};

export default AdvanceSection;
