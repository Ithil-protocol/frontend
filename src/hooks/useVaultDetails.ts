import { useContractReads } from "wagmi";

import { vaultContracts } from "@/contracts";
import { VaultName } from "@/types";
import { formatToken } from "@/utils";

type FunctionName =
  | "currentProfits"
  | "currentLosses"
  | "netLoans"
  | "latestRepay";

type Data = { [key in FunctionName]: string };

export const useVaultDetails = (vault: VaultName) => {
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

  const data = contracts.reduce((prevValue, currValue, index) => {
    prevValue[currValue.functionName as FunctionName] = formatToken(
      vault,
      result?.data?.[index]?.result || 0n
    )!;
    return prevValue;
  }, {} as Data);

  return {
    ...result,
    data,
  };
};
