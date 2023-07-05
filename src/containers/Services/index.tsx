import { Button, Heading, Text, useColorMode } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Head from "next/head";
import Link from "next/link";
import { type FC, useMemo, useState } from "react";

import { Aave } from "@/assets/svgs";
import PageWrapper from "@/components/page-wrapper";
import { palette } from "@/styles/theme/palette";
import {
  type Services,
  type SupportedServiceName,
} from "@/types/onchain.types";
import { pickColor } from "@/utils/theme";

const ServiceToken: FC<{ token: string }> = ({ token }) => (
  <div className="flex py-1 min-w-[92px] border border-primary-500 rounded-md">
    <Text textStyle="slender-sm" fontWeight="normal" className="mx-auto">
      {token.toUpperCase()}
    </Text>
  </div>
);

interface ServiceCardProps {
  assets: string[];
  description: string | ((assets: string[]) => string);
  to: string;
  multiplier: string;
  name: string;
  apy: string;
  tvl: string;
}

const ServiceCard: FC<ServiceCardProps> = ({
  assets,
  description,
  to,
  multiplier,
  name,
  apy,
  tvl,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Link
      href={`/services/${to}`}
      className="flex flex-col p-7 rounded-xl bg-primary-100"
    >
      <div className="flex justify-between mb-6">
        <Aave className="w-7 h-7" />
        {/* 1 - 10% multiplier */}
        <div className="flex items-center gap-1 px-2 py-1 border rounded-md border-primary-500">
          <Icon
            icon="ph:lightning-fill"
            color={colorMode === "dark" ? "white" : "black"}
          ></Icon>
          <Text textStyle="slender-sm">{multiplier}</Text>
        </div>
      </div>
      <Heading size="h3" className="mb-6">
        {name}
      </Heading>
      <div className="flex py-3 mb-4 rounded-md bg-primary-600">
        <div className="flex items-center gap-2 mx-auto">
          <Text textStyle="slender-md">{apy}</Text>
          <Text textStyle="md2">APY</Text>
        </div>
      </div>
      <Text className="mb-4">
        {typeof description === "string" ? description : description(assets)}
      </Text>
      <div className="flex gap-2 mb-4">
        <Text
          textStyle="sm"
          color={pickColor(colorMode, palette.colors.primary, "700")}
        >
          TVL:
        </Text>
        <Text textStyle="slender-sm2">{tvl}</Text>
      </div>
      {/* tokens array */}
      <div className="flex flex-wrap gap-2 mb-6 justify-evenly">
        {assets.map((token) => (
          <ServiceToken token={token} key={token} />
        ))}
      </div>
      <Button size="lg" className="w-full">
        Enter
      </Button>
    </Link>
  );
};

const ServicesGrid: FC<{ services: Services }> = ({ services }) => {
  return (
    <div className="grid gap-4 py-10 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
      <ServiceCard
        assets={["USDC", "USDT", "DAI", "WETH", "WBTC"]}
        description={services.aave.description}
        to={"aave"}
        multiplier={"1 - 3%"}
        name={services.aave.name}
        apy={"%12"}
        tvl={"$ 9"}
      />
    </div>
  );
};

interface Props {
  services: Services;
}

const ServicesPage: FC<Props> = ({ services }) => {
  const [filteredService, setFilteredService] =
    useState<SupportedServiceName | null>(null);

  const filteredServices: Services = useMemo(() => {
    if (filteredService === null) return services;
    const whitelistService = services[filteredService];
    return { [filteredService]: whitelistService };
  }, [services, filteredService]);

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
      <PageWrapper heading="Services" textAlign="left">
        <ServicesGrid services={filteredServices} />
      </PageWrapper>
    </>
  );
};

export default ServicesPage;
