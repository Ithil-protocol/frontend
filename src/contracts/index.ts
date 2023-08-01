import { Address } from "viem";

import { vaultABI } from "@/abi/";
import { assets } from "@/data/assets";

interface Contract {
  address: Address;
  abi: typeof vaultABI;
  decimals: number;
}

interface VaultContracts {
  [key: string]: Contract;
}

export const vaultContracts: VaultContracts = {};

assets.forEach((vault) => {
  vaultContracts[vault.name] = {
    address: vault.vaultAddress as Address,
    abi: vaultABI,
    decimals: vault.decimals,
  };
});
