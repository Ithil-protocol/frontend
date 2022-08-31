import BigNumber from 'bignumber.js';

export type VaultStatusType = {
  apr: number;
  tvl: BigNumber;
};

export type VaultsType = {
  [address: string]: VaultStatusType;
};
