import { type Address } from "wagmi";

// the minimal intersection of LendingToken and ServiceAsset
export interface Token {
  name: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: Address;
}

// used in Lend page
export interface LendingToken extends Token {
  vaultAddress: Address;
}
export type LendingTokenList = LendingToken[];
export type Vaults = Array<{
  key: string;
  token: LendingTokenList[number];
  tvl?: bigint;
  borrowed?: bigint;
  deposited?: bigint;
}>;

// used in services page
export interface AaveAsset {
  name: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: Address;
  collateralTokenAddress: Address;
}
export type AaveAssetHash = Record<Lowercase<string>, AaveAsset>;

// JSON source data is in this format
export interface AaveJson {
  name: string;
  description: string;
  assets: AaveAsset[];
}
// will get converted in this (more convenient) format
export interface AaveService extends Omit<AaveJson, "assets"> {
  assets: AaveAssetHash;
  address: Address;
}

export interface Services {
  aave: AaveService;
  [key: Lowercase<string>]: unknown;
}

// add 'gmx' here
type ServicesAvailable = "aave";
export type SupportedServiceName = Lowercase<ServicesAvailable>;
