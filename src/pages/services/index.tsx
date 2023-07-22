import { Box } from "@chakra-ui/react";

import Heading from "@/components/Heading";
import ServicesPage from "@/containers/Services";

const Services = () => {
  return (
    <Box className="flex flex-col items-start w-full p-5 mx-auto font-sans gap-7">
      <Heading heading="Services" />
      <ServicesPage />
    </Box>
  );
};

export default Services;
