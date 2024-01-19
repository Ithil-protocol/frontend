// const mobileHiddenColumnClass = "hidden md:table-cell";
import { Box } from "@chakra-ui/react";
import { FC } from "react";

import Heading from "@/components/Heading";

import Table from "./Table";

const Lend: FC = () => {
  return (
    <Box className="flex flex-col items-start w-full p-5 mx-auto font-sans gap-7">
      <Heading heading="Lend" />
      <Table />
    </Box>
  );
};

export default Lend;
