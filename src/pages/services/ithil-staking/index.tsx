import { GetStaticPaths, GetStaticProps } from "next";

import IthilStaking from "@/containers/Service/IthilStaking";
import { assets } from "@/data/assets";

const IthilStakingPage = () => {
  return <IthilStaking />;
};

export const getStaticPaths: GetStaticPaths<{
  asset: string;
}> = async () => {
  const paths = assets.map((item) => ({
    params: {
      asset: item.name.toLowerCase(),
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

export default IthilStakingPage;
