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
  // console.log("ii", vault);
  const { data: vaultFreeLiquidity } = useVaultFreeLiquidity({
    address: vault?.vaultAddress as Address,
    enabled: !!vault,
  });

  const { data } = useServiceComputeBaseRateAndSpread({
    args: [tokenAddress, loan, margin, vaultFreeLiquidity as bigint],
    enabled: !!vaultFreeLiquidity,
  });

  // console.log(
  //   "ii",
  //   "vaultFreeLiquidity:",
  //   vaultFreeLiquidity,
  //   "loan:",
  //   loan,
  //   "margin:",
  //   margin
  // );
  // console.log("ii2", data);

  if (data) {
    return (
      ((data[0] * 101n) / 100n) * BigInt(2 ** 128) + (data[1] * 101n) / 100n
    );
  }
  // or throw an error to stop user from opoenning position
  return 0n;
};
