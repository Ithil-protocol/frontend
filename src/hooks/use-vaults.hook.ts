import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import Decimal from "decimal.js";
import { useAccount } from "wagmi";

import { assets } from "@/data/assets";
import { vaultABI } from "@/hooks/generated/vault";
import { type Vaults } from "@/types/onchain.types";
import { ErrorCause } from "@/utils/error-cause";
import { multiplyBigNumbers, oneUnitWithDecimals } from "@/utils/input.utils";

const VaultAbi = [...vaultABI];

const getVaultData = async (address?: string) => {
  const totalAssetsCalls = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "totalAssets",
  }));
  const freeLiquidityCalls = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "freeLiquidity",
  }));

  const balanceOfCalls =
    address != null
      ? assets.map((token) => ({
          address: token.vaultAddress,
          abi: VaultAbi,
          functionName: "balanceOf",
          args: [address],
        }))
      : [];

  const convertToAssetCalls = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "convertToAssets",
    args: [oneUnitWithDecimals(token.decimals)],
  }));
  const netLoans = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "netLoans",
  }));

  const creationTime = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "creationTime",
  }));

  const multicallData = await multicall({
    contracts: [
      ...totalAssetsCalls,
      ...freeLiquidityCalls,
      ...balanceOfCalls,
      ...convertToAssetCalls,
      ...netLoans,
      ...creationTime,
    ],
  });

  if (multicallData.some((data) => data == null)) {
    throw new Error("Error fetching vault data", {
      cause: new ErrorCause(
        "In localhost a wallet has to be connected for the UI to function"
      ),
    });
  }

  const length = assets.length;

  const data: Vaults = assets.map((asset, idx) => {
    console.log("multicallData", multicallData);

    // tvl informations are available at index 0...length
    const tvl = multicallData[idx].result as bigint;
    // freeLiquidity informations are available at index length...length*2

    // const freeLiquidity = multicallData[length + idx].result as bigint;

    // deposited informations are available at index length*2...length*3
    const depositedShares =
      address != null
        ? (multicallData[length * 2 + idx].result as bigint)
        : BigInt(0);
    // sharesToAsset informations are available at index length*3...length*4
    const sharesToAsset = multicallData[length * 3 + idx].result as bigint;
    const depositedAssets = multiplyBigNumbers(
      depositedShares,
      sharesToAsset,
      asset.decimals
    );
    const borrowed = multicallData[length * 4 + idx].result as bigint;

    const apy = new Decimal(
      new Decimal(sharesToAsset.toString())
        .div(10 ** asset.decimals)
        .minus(1)
        .toString()
    )
      .mul(365 * 86400)
      .div(
        new Date().getTime() / 1000 -
          Number(multicallData[length * 5 + idx].result)
      );

    return {
      token: asset,
      tvl,
      borrowed,
      deposited: depositedAssets,
      apy: apy.toString(),
    };
  });
  return data;
};

export const useVaults = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["vaults", address],
    queryFn: async () => await getVaultData(address),
    keepPreviousData: true,
    placeholderData: assets.map((asset) => ({ token: asset })),

    retry: (failureCount, error: Error): boolean => {
      // avoid retrying if the error is handled
      if (ErrorCause.isErrorCause(error.cause)) return false;
      return true;
    },

    // FIXME: handle errors with chakra-ui/toast
    // onError: (error: Error) => {}
  });
};
