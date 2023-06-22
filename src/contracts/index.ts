import { vaultABI } from "@/abi/";
import vaults from "@/deploy/vaults.json";

interface Contract {
  address: `0x${string}`;
  abi: typeof vaultABI;
}

interface VaultContracts {
  [key: string]: Contract;
}

export const vaultContracts: VaultContracts = {};

vaults.forEach((vault) => {
  vaultContracts[vault.name] = {
    address: vault.vaultAddress as `0x${string}`,
    abi: vaultABI,
  };
});
