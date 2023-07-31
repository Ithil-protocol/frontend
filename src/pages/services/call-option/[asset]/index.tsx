import { GetStaticPaths, GetStaticProps } from "next";

import CallOption from "@/containers/Service/CallOption";
import assets from "@/deploy/assets.json";

const CallOptionPage = () => {
  return <CallOption />;
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

export default CallOptionPage;
