import { Button, Heading, Text, useColorMode } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

import services from "@/data/services.json";
import { palette } from "@/styles/theme/palette";
import { Service } from "@/types";
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
  icon: string;
}

const ServiceCard: FC<ServiceCardProps> = ({
  assets,
  description,
  to,
  multiplier,
  name,
  apy,
  tvl,
  icon,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Link
      href={`/services/${to}`}
      className="flex flex-col p-7 rounded-xl bg-primary-100"
    >
      <div className="flex justify-between mb-6">
        <Image src={icon} alt={name + " icon"} width={28} height={28} />
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
          <Text textStyle="md2">Best APY</Text>
          <Text textStyle="slender-md">{apy}</Text>
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

const ServicesGrid: FC<{ services: Service[] }> = ({ services }) => {
  return (
    <div className="grid gap-4 py-10 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
      {services.map((item, index) => (
        <ServiceCard
          key={item.name + index}
          assets={item.tokens}
          description={item.description}
          to={item.url}
          multiplier={`${item.apyRange}%`}
          name={item.name}
          apy={`%${item.bestApy}`}
          tvl={`${item.tvl}m`}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

const ServicesPage = () => {
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
      <ServicesGrid services={services} />
    </>
  );
};

export default ServicesPage;
