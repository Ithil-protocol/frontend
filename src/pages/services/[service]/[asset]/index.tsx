import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { FC } from "react";

import ServicePage from "@/containers/Service";
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
  return <ServicePage service={service} asset={asset} />;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const { names, services } = getServices();
  // Generate all possible paths for the dynamic route
  const paths = names.flatMap((serviceName) => {
    const assets = Object.keys(services[serviceName].assets) as Array<
      Lowercase<string>
    >;
    return assets.map((asset) => ({ params: { service: serviceName, asset } }));
  });

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
