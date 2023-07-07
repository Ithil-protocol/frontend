import { Address, formatEther } from "viem";

import { fixPrecision, getVaultByTokenAddress } from "@/utils";

import { useServiceComputeBaseRateAndSpread } from "./generated/service";
import { useVaultFreeLiquidity } from "./generated/vault";

const spreadToUint256 = (base: bigint, spread: bigint) => {
  return ((base * 101n) / 100n) * BigInt(2 ** 128) + (spread * 101n) / 100n;
};
const displayInterestSpread = (base: bigint, spread: bigint) => {
  const result = formatEther(base + spread);
  return fixPrecision(Number(result) * 100, 2);
};

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

  const result = {
    interestAndSpread: 0n,
    displayInterestAndSpreadInPercent: 0,
  };
  if (data) {
    result.interestAndSpread = spreadToUint256(...data);
    result.displayInterestAndSpreadInPercent = displayInterestSpread(...data);
    return result;
  }
  // or throw an error to stop user from opoenning position
  return result;
};

export const reverseDisplayInterestSpreadInPercent = (
  interestAndSpread: bigint
) => {
  const twoPow128 = BigInt(2 ** 128);
  const base = interestAndSpread % twoPow128;
  const spread = interestAndSpread / twoPow128;
  let result = (base + spread).toString();
  result = formatEther(base + spread);
  return fixPrecision(Number(result) * 100, 2);
};
