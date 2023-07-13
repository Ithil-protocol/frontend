import Head from "next/head";
import { type FC } from "react";

import services from "@/data/services.json";
import { Service } from "@/types";

import ServiceCard from "./ServiceCard";

const ServicesGrid: FC<{ services: Service[] }> = ({ services }) => {
  return (
    <div className="grid mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
      {services.map((item, index) => (
        <ServiceCard
          key={item.name + index}
          assets={item.tokens}
          description={item.description}
          to={item.url}
          multiplier={`${item.apyRange}%`}
          name={item.name}
          apy={`${item.bestApy}%`}
          tvl={`${item.tvl}m`}
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
