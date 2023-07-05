import { useContractReads } from "wagmi";

import { vaultContracts } from "@/contracts";

type FunctionName =
  | "currentProfits"
  | "currentLosses"
  | "netLoans"
  | "latestRepay";

type Data = { [key in FunctionName]: bigint | undefined };

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
  ] as const;

  const result = useContractReads({
    contracts,
  });

  console.log(result);

  const data = contracts.reduce((prevValue, currValue, index) => {
    prevValue[currValue.functionName as FunctionName] =
      result?.data?.[index]?.result;
    return prevValue;
  }, {} as Data);

  return {
    ...result,
    data,
  };
};
