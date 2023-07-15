import { Box } from "@chakra-ui/react";
import Head from "next/head";

import Heading from "@/components/Heading";
import ServicesPage from "@/containers/Services";

const Services = () => {
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
      <Box className="flex flex-col items-start w-full p-5 mx-auto font-sans gap-7">
        <Heading heading="Services" />
        <ServicesPage />
      </Box>
    </>
  );
};

export default Services;
