import { Address } from "viem";

import { vaultABI } from "@/abi/";
import vaults from "@/deploy/assets.json";

interface Contract {
  address: Address;
  abi: typeof vaultABI;
  decimals: number;
}

interface VaultContracts {
  [key: string]: Contract;
}

export const vaultContracts: VaultContracts = {};

vaults.forEach((vault) => {
  vaultContracts[vault.name] = {
    address: vault.vaultAddress as Address,
    abi: vaultABI,
    decimals: vault.decimals,
  };
});
