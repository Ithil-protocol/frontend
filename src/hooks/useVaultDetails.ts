import { useContractReads } from "wagmi";

import { vaultContracts } from "@/contracts";

export const useVaultDetails = (vault: string) => {
  const vaultContract = vaultContracts[vault.toUpperCase()];

  return useContractReads({
    contracts: [
      {
        ...vaultContract,
        functionName: "currentProfits",
      },
      {
        ...vaultContract,
        functionName: "currentLosses",
      },
      {
        ...vaultContract,
        functionName: "netLoans",
      },
      {
        ...vaultContract,
        functionName: "latestRepay",
      },
    ],
  });
};
