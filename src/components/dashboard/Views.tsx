import { Box, Button, ButtonGroup, Text, useColorMode } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

import { palette } from "@/styles/theme/palette";
import { viewTypes } from "@/types";
import { mode, pickColor } from "@/utils/theme";

interface Props {
  currentView: viewTypes;
  setActiveView: Dispatch<SetStateAction<viewTypes>>;
}

const views: viewTypes[] = ["Active", "Closed", "Liquidated"];

const Views: FC<Props> = ({ currentView, setActiveView }) => {
  const { colorMode } = useColorMode();
  const handleActiveView = (view: viewTypes) => {
    setActiveView(view);
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="71px"
      bgColor={pickColor(colorMode, palette.colors.primary, "100")}
      paddingX="30px"
      paddingY="10px"
      borderRadius="12px"
    >
      <Text
        className="font-sans"
        size="22px"
        fontWeight="bold"
        lineHeight="24px"
      >
        View
      </Text>
      <ButtonGroup>
        {views.map((view, key) => (
          <Button
            key={view + key}
            onClick={() => handleActiveView(view)}
            variant={currentView === view ? "solid" : "ghost"}
            bgColor={
              currentView === view
                ? pickColor(colorMode, palette.colors.primary, "300")
                : "transparent"
            }
            fontWeight={currentView === view ? "bold" : "normal"}
            fontSize={"16px"}
            color={
              currentView === view
                ? mode(colorMode, "main", "main.dark")
                : mode(colorMode, "primary.700", "primary.700.dark")
            }
            paddingX="30"
            paddingY="4"
          >
            {view}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default Views;
