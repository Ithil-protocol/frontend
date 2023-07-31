import { GetStaticPaths, GetStaticProps } from "next";

import CallOption from "@/containers/Service/CallOption";
import vaults from "@/deploy/assets.json";

const CallOptionPage = () => {
  return <CallOption />;
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

export default CallOptionPage;
