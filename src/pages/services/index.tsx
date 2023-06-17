import { GetStaticProps, GetStaticPropsContext } from "next";
import { FC } from "react";

import ServicesPage from "@/containers/Services";
import { getServices } from "@/hooks/use-services.hook";
import { Services as ServicesType } from "@/types/onchain.types";

interface Props {
  services: ServicesType;
}

const Services: FC<Props> = ({ services }) => {
  return <ServicesPage services={services} />;
};

export const getStaticProps: GetStaticProps = (
  _context: GetStaticPropsContext
) => {
  const { services } = getServices();
  return {
    props: {
      services,
    },
  };
};

export default Services;
