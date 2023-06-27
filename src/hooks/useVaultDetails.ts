import { useContractReads } from "wagmi";

import { vaultContracts } from "@/contracts";

export const useVaultDetails = (vault: string) => {
  const vaultContract = vaultContracts[vault.toUpperCase()];

  const contracts = [
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
  ];

  const result = useContractReads({
    contracts,
  });

  const data: any = {};
  contracts.forEach(({ functionName }, index) => {
    data[functionName] = result?.data?.[index]?.result;
  });

  return {
    ...result,
    data,
  };
};
