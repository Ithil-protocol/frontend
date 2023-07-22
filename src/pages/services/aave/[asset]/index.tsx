import { GetStaticPaths, GetStaticProps } from "next";

import Aave from "@/containers/Service/Aave";
import vaults from "@/deploy/vaults.json";

const Service = () => {
  return <Aave />;
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

export default Service;
