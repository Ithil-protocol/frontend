import { GetStaticPaths, GetStaticProps } from "next";

import FixedYield from "@/containers/Service/FixedYield";
import vaults from "@/deploy/vaults.json";

const FixedYieldPage = () => {
  return <FixedYield />;
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
