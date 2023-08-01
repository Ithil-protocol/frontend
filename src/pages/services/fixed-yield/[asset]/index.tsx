import { GetStaticPaths, GetStaticProps } from "next";

import FixedYield from "@/containers/Service/FixedYield";
import assets from "@/deploy/assets.json";

const FixedYieldPage = () => {
  return <FixedYield />;
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

export default FixedYieldPage;
