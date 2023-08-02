import { Box, Text } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

import { viewTypes } from "@/types";

import Views from "./Views";

interface Props {
  currentView: viewTypes;
  setActiveView: Dispatch<SetStateAction<viewTypes>>;
}

const Header: FC<Props> = ({ currentView, setActiveView }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="full"
      flexDirection={["column", "column", "column", "row"]}
      gap={["50px"]}
    >
      <Box display="flex" alignItems={["start", "center"]} gap="15">
        <Text fontWeight="bold" fontSize="24px">
          {currentView} Positions
        </Text>
      </Box>
      <Views currentView={currentView} setActiveView={setActiveView} />
    </Box>
  );
};

export default Header;
