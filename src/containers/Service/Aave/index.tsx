import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import aave from "@/data/aave";

import Form from "./Form";

const Aave = () => {
  const {
    query: { asset: token },
  } = useRouter();

  const asset = aave.assets.find((asset) => asset.name.toLowerCase() === token);

  if (!asset) return null;

  return (
    <Box className="grid w-full grid-cols-10 gap-6">
      {/* <ServiceContent service={aaveService} /> */}
      <Box className="flex-shrink-0 col-span-full lg:col-span-3">
        <Form asset={asset} />
      </Box>
    </Box>
  );
};

export default Aave;
