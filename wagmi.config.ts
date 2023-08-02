import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { Address } from "viem";
import { erc20ABI } from "wagmi";

import {
  aaveABI,
  callOptionABI,
  fixedYieldABI,
  gmxABI,
  managerABI,
  vaultABI,
} from "@/abi";
import contracts from "@/deploy/contracts.json";

export default defineConfig([
  {
    out: "src/hooks/generated/aave.ts",
    contracts: [
      {
        name: "Aave",
        // address: {
        //   1337:
        //     // same for now, but it can happen they have different addresses
        //     coreConfig.instance === CoreInstance.PrivateTestnet
        //       ? "0xD1d01555b5DC60ba330414be2266f4FAC195a32B"
        //       : "0xD1d01555b5DC60ba330414be2266f4FAC195a32B",
        // },
        address: {
          98745: contracts.aaveService as Address,
        },
        abi: aaveABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: "src/hooks/generated/vault.ts",
    contracts: [
      {
        name: "Vault",
        abi: vaultABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: "src/hooks/generated/manager.ts",
    contracts: [
      {
        name: "Manager",
        abi: managerABI,
        address: {
          98745: contracts.manager as Address,
        },
      },
    ],
    plugins: [react()],
  },
  {
    out: "src/hooks/generated/gmx.ts",
    contracts: [
      {
        name: "Gmx",
        abi: gmxABI,
        address: {
          98745: contracts.gmxService as Address,
        },
      },
    ],
    plugins: [react()],
  },
  {
    out: "src/hooks/generated/callOption.ts",
    contracts: [
      {
        name: "CallOption",
        abi: callOptionABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: "src/hooks/generated/fixedYield.ts",
    contracts: [
      {
        name: "FixedYield",
        abi: fixedYieldABI,
        address: {
          98745: contracts.fixedYieldService as Address,
        },
      },
    ],
    plugins: [react()],
  },
  {
    out: "src/hooks/generated/token.ts",
    contracts: [
      {
        abi: erc20ABI,
        name: "Token",
      },
    ],
    plugins: [react()],
  },
]);
