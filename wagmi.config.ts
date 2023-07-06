import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { Address } from "viem";

import { vaultABI } from "@/abi";
import contracts from "@/deploy/contracts.json";

import ServiceAbi from "./src/abi/Service.abi";

export default defineConfig([
  {
    out: "src/hooks/generated/service.ts",
    contracts: [
      {
        name: "Service",
        // address: {
        //   1337:
        //     // same for now, but it can happen they have different addresses
        //     coreConfig.instance === CoreInstance.PrivateTestnet
        //       ? "0xD1d01555b5DC60ba330414be2266f4FAC195a32B"
        //       : "0xD1d01555b5DC60ba330414be2266f4FAC195a32B",
        // },
        address: {
          42161: contracts.aaveService as Address,
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
  },
  {
    out: "src/hooks/generated/vault.ts",
    contracts: [
      {
        name: "Vault",
        abi: vaultABI,
      },
    ],
    plugins: [
      react({
        useContractWrite: false,
        useContractFunctionWrite: false,
      }),
    ],
  },
]);
