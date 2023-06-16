import { Box, Link, Text, useColorMode } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

import { ArrowLeft } from "@/assets/svgs";
import { viewTypes } from "@/types";

import Views from "./Views";

interface Props {
  currentView: viewTypes;
  setActiveView: Dispatch<SetStateAction<viewTypes>>;
}

const Header: FC<Props> = ({ currentView, setActiveView }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="full"
      marginTop={["50px", "50px", "135"]}
      flexDirection={["column", "column", "row"]}
      gap={["50px"]}
    >
      <Box display="flex" alignItems={["start", "center"]} gap="15">
        <Link href="/">
          <ArrowLeft
            className={`${colorMode === "light" && "fill-[#070b0f]"}`}
          />
        </Link>
        <Text fontWeight="bold" fontSize="24px">
          Open Positions
        </Text>
      </Box>
      <Views currentView={currentView} setActiveView={setActiveView} />
    </Box>
  );
};

export default Header;
