import { GetStaticPaths, GetStaticProps } from "next";

import Aave from "@/containers/Service/Aave";
import { assets } from "@/data/assets";

const Service = () => {
  return <Aave />;
};

export const getStaticPaths: GetStaticPaths<{
  asset: string;
}> = async () => {
  const paths = assets.map((vault) => ({
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
