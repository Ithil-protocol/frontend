import { GetStaticPaths, GetStaticProps } from "next";

import Gmx from "@/containers/Service/Gmx";
import { assets } from "@/data/assets";

const GmxPage = () => <Gmx />;

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

export default GmxPage;
