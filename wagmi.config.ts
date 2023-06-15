import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";

import ServiceAbi from "./src/abi/Service.abi";
import { CoreInstance, coreConfig } from "./src/config/env";

export default defineConfig({
  out: "src/hooks/generated/service.ts",
  contracts: [
    {
      name: "Service",
      address: {
        1337:
          // same for now, but it can happen they have different addresses
          coreConfig.instance === CoreInstance.PrivateTestnet
            ? "0xD1d01555b5DC60ba330414be2266f4FAC195a32B"
            : "0xD1d01555b5DC60ba330414be2266f4FAC195a32B",
      },
      abi: ServiceAbi,
    },
  ],
  plugins: [
    react({
      useContractWrite: false,
      useContractFunctionWrite: false,
    }),
  ],
});
