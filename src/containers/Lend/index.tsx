// const mobileHiddenColumnClass = "hidden md:table-cell";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { FC } from "react";

import Heading from "@/components/Heading";

import Table from "./Table";

const Lend: FC = () => {
  return (
    <>
      <Head>
        <title>Ithil - Lending</title>
        <meta
          name="description"
          content="Official frontend for Ithil strategies"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className="flex flex-col items-start w-full p-5 mx-auto font-sans gap-7">
        <Heading heading="Lend" />
        <Table />
      </Box>
    </>
  );
};

export default Lend;
