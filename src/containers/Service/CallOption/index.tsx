import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { getAssetByName, getServiceByName, getSingleQueryParam } from "@/utils";

import PriceChart from "../PriceChart";
import ServiceHeading from "../ServiceHeading";
import Form from "./Form";

const CallOption = () => {
  const {
    query: { asset: token },
  } = useRouter();

  const [redeem, setRedeem] = useState(0);

  const normalizedToken = getSingleQueryParam(token);

  const asset = getAssetByName(normalizedToken);

  const service = getServiceByName("call-option");
  if (!service) return null;
  return (
    <Box className="grid w-full grid-cols-10 gap-6">
      <Box className="flex flex-col flex-grow gap-6 col-span-full lg:col-span-7">
        <ServiceHeading service={service} />
        {/* <Graph data={chartData} tab="apy" /> */}
        <PriceChart price={redeem} />
      </Box>
      <Box className="flex-shrink-0 col-span-full lg:col-span-3">
        {asset && <Form asset={asset} setRedeem={setRedeem} />}
      </Box>
    </Box>
  );
};

export default CallOption;
