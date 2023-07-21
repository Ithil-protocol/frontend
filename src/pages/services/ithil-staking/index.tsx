import Head from "next/head";

import IthilStaking from "@/containers/Service/IthilStaking";

const IthilStakingPage = () => {
  return (
    <>
      <Head>
        <title>Ithil - Ithil Staking service</title>
        <meta
          name="description"
          content="Official frontend for Ithil strategies"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <IthilStaking />
    </>
  );
};

export default IthilStakingPage;
