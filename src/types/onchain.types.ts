import { type Address } from "wagmi";

import { Asset } from ".";

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

export type Vault = {
  token: Asset;
  tvl?: bigint;
  borrowed?: bigint;
  deposited?: bigint;
  apy?: string;
};

export type Vaults = Vault[];
