// const mobileHiddenColumnClass = "hidden md:table-cell";
import Head from "next/head";
import { FC } from "react";

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
      <Table />
    </>
  );
};

export default Lend;
