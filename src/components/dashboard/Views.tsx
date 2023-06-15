import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

import { viewTypes } from "@/types";

interface Props {
  currentView: viewTypes;
  setActiveView: Dispatch<SetStateAction<viewTypes>>;
}

const views: viewTypes[] = ["Active", "Closed", "Liquidated"];

const Views: FC<Props> = ({ currentView, setActiveView }) => {
  const handleActiveView = (view: viewTypes) => {
    setActiveView(view);
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="71px"
      bg="primary.main.100"
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
          >
            {view}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default Views;
