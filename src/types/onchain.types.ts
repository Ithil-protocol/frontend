export interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  logoURI: string;
}

export type TokenList = TokenDetails[];
