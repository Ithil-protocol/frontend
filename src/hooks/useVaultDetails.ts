import { useContractReads } from "wagmi";

import { vaultContracts } from "@/contracts";
import { VaultName } from "@/types";

import { useIsMounted } from "./useIsMounted";

type FunctionName =
  | "freeLiquidity"
  | "netLoans"
  | "currentProfits"
  | "currentLosses"
  | "convertToShares";

type Data = { [key in FunctionName]: bigint | undefined };

export const useVaultDetails = (vault: VaultName) => {
  const vaultContract = vaultContracts[vault.toUpperCase()];

  const contracts = [
    {
      ...vaultContract,
      functionName: "freeLiquidity",
    },
    {
      ...vaultContract,
      functionName: "netLoans",
    },
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
      functionName: "convertToShares",
      args: [10n ** BigInt(vaultContract?.decimals ?? 0)],
    },
  ] as const;

  const result = useContractReads({
    contracts,
  });

  // const data = contracts.reduce((prevValue, currValue, index) => {
  //   prevValue[currValue.functionName as FunctionName] = formatToken(
  //     vault,
  //     result?.data?.[index]?.result || 0n
  //   )!;
  //   return prevValue;
  // }, {} as Data);

  const data = {} as Data;
  contracts.forEach(({ functionName }, index) => {
    data[functionName as FunctionName] = result?.data?.[index]?.result;
  });

  const isMounted = useIsMounted();

  return {
    ...result,
    isLoading: result.isLoading || !isMounted,
    data,
  };
};
