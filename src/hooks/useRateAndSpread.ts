import { Address } from "viem";

import { getVaultByTokenAddress } from "@/utils";

import { useServiceComputeBaseRateAndSpread } from "./generated/service";
import { useVaultFreeLiquidity } from "./generated/vault";

interface Props {
  tokenAddress: Address;
  loan: bigint;
  margin: bigint;
}

export const useRateAndSpread = ({ tokenAddress, loan, margin }: Props) => {
  const vault = getVaultByTokenAddress(tokenAddress);
  const { data: vaultFreeLiquidity } = useVaultFreeLiquidity({
    address: vault?.vaultAddress as Address,
    enabled: !!vault,
  });

  const { data } = useServiceComputeBaseRateAndSpread({
    args: [tokenAddress, loan, margin, vaultFreeLiquidity as bigint],
  });

  console.log("ii", data);
};
