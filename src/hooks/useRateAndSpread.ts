import { Address, parseEther } from "viem";

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
  // console.log("ii", vault);
  const { data: vaultFreeLiquidity } = useVaultFreeLiquidity({
    address: vault?.vaultAddress as Address,
    enabled: !!vault,
  });

  const { data } = useServiceComputeBaseRateAndSpread({
    args: [tokenAddress, loan, margin, vaultFreeLiquidity as bigint],
    enabled: !!vaultFreeLiquidity,
  });

  if (data) {
    return (data[0] + data[1]) / parseEther("1");
  }
  // or throw an error to stop user from opoenning position
  return 0n;
  // console.log("ii", "vaultFreeLiquidity:", vaultFreeLiquidity,"loan:",loan, "margin:",margin, );
  // console.log("ii2", data);
};
