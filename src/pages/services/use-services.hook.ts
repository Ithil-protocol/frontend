import { useMemo } from "react";
import { type Address } from "wagmi";

import contracts from "@/deploy/contracts.json";
import {
  type AaveAssetHash,
  type AaveJson,
  type Services,
  type SupportedServiceName,
} from "@/types/onchain.types";

import aave from "./aave.json";

export const getServices = () => {
  // Example result: { 'aave': { 'usdt': { name: 'usdt', address: '0x...'}, 'usdc': {...} } }
  const { assets, ...rest } = aave as AaveJson;

  const assetsHash = assets.reduce<AaveAssetHash>((assetHash, asset) => {
    assetHash[asset.name.toLowerCase() as Lowercase<string>] = asset;
    return assetHash;
  }, {});

  const names: SupportedServiceName[] = ["aave"];
  const services: Services = {
    aave: {
      assets: assetsHash,
      address: contracts.aaveService as Address,
      ...rest,
    },
  };
  const serviceList = [{ name: services.aave.name, id: "aave" }];
  return { names, services, serviceList };
};

export const useServices = () => {
  return useMemo(() => getServices(), []);
};
