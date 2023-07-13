import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import { FC } from "react";

import ServicePage from "@/containers/Service";
import vaults from "@/deploy/vaults.json";
import { getServices } from "@/hooks/use-services.hook";
import {
  AaveAsset,
  AaveService,
  SupportedServiceName,
} from "@/types/onchain.types";

interface Params extends NodeJS.Dict<string> {
  service: string;
  asset: string;
}

interface Props {
  service: AaveService;
  asset: AaveAsset;
}

const Service: FC<Props> = ({ service, asset }) => {
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
      <ServicePage service={service} asset={asset} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = vaults.map((vault) => ({
    params: {
      service: "aave",
      asset: vault.name.toLowerCase(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (
  context: GetStaticPropsContext
) => {
  const { names, services } = getServices();
  if (context.params == null) return { redirect: "/services", props: {} };
  if (
    typeof context.params?.service !== "string" ||
    typeof context.params?.asset !== "string"
  )
    return { redirect: "/services", props: {} };
  const serviceParam =
    context.params.service.toLowerCase() as SupportedServiceName;
  const assetParam = context.params.asset.toLowerCase() as Lowercase<string>;
  if (!names.includes(serviceParam))
    return { redirect: "/services", props: {} };
  // param validation done

  const service = services[serviceParam];
  const asset = service.assets[assetParam];
  if (asset == null) return { redirect: "/services", props: {} };

  return {
    props: {
      service,
      serviceName: serviceParam,
      asset,
    } as Props,
  };
};

export default Service;
