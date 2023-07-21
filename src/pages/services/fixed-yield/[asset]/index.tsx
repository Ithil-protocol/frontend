import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import FixedYield from "@/containers/Service/FixedYield";
import vaults from "@/deploy/vaults.json";

const FixedYieldPage = () => {
  return (
    <>
      <Head>
        <title>Ithil - Services</title>
        <meta
          name="description"
          content="Official frontend for Ithil strategies"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FixedYield />
    </>
  );
};
export const getStaticPaths: GetStaticPaths<{
  asset: string;
}> = async () => {
  const paths = vaults.map((vault) => ({
    params: {
      asset: vault.name.toLowerCase(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};

export default FixedYieldPage;
