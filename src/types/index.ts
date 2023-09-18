import { SafetyScoreValue, getServiceNames } from "@/utils";

export type viewTypes = "Active" | "Closed";

export type VoidNoArgs = () => void;

export type PromiseVoidNoArgs = () => Promise<void>;

export interface PositionsDetailItemType {
  title: string;
  value: string;
  unit?: string;
}

export type Address = `0x${string}`;

export interface ChartDataPoint {
  date: Date;
  tvl: number;
  apy: number;
}

export interface VaultsTypes {
  name: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: string;
  vaultAddress: string;
}

export type AssetName = "USDC" | "USDT" | "WETH" | "WBTC" | "DAI";
export interface ChartPoint {
  timestamp: Date;
  tvlUsd: number;
  apyBase: number;
}
export interface SafetyScore {
  score: number;
  features: {
    value: SafetyScoreValue;
    text: string;
    extendedDescription?: string;
  }[];
  description: string;
}

const serviceNames = getServiceNames();
export type ServiceName = (typeof serviceNames)[number];

export interface Service {
  label: string;
  name: ServiceName;
  long_name: string;
  description: string;
  apyRange?: string;
  hasIndex: boolean;
  bestApy: number;
  boostApy: number;
  tokens: AssetName[];
  tvl: number;
  deadline: number;
  url: string;
  safety_score: SafetyScore;
  explanation: string;
  type: "debit" | "credit";
}
export type Asset = {
  name: string;
  label: string;
  description: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: Address;
  oracleAddress: Address;
  vaultAddress: Address;
  callOptionAddress: Address;
  aaveCollateralTokenAddress: Address;
  gmxCollateralTokenAddress: Address;
  iTokenAddress: Address;
};
export interface PositionType {
  token: Address;
  amount: string;
  margin: string | number;
  createdAt: bigint | undefined;
  type: ServiceName;
  pnlPercentage?: string;
  pnl?: string;
  isPnlLoading?: boolean;
  id: bigint | undefined;
  quote?: bigint;
  formattedPnl?: string;
  name: string;
}

export interface PageHeading {
  pathName: string;
  heading: string;
}

export type CloseDialogFn = VoidNoArgs;

export interface TokenModalOptions {
  assets: Asset[];
  isClosable: boolean;
  onSelectTokenCallback: () => void;
  returnPath: string;
}

export type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type OpenTokenDialogFn = (
  assets: Asset[],
  serviceName: ServiceName
) => void;
export type Ithil = {
  name: string;
  label: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: Address;
};

export interface Agreement {
  loans: readonly {
    token: Address;
    amount: bigint;
    margin: bigint;
    interestAndSpread: bigint;
  }[];
  collaterals: readonly {
    itemType: number;
    token: Address;
    identifier: bigint;
    amount: bigint;
  }[];
  createdAt: bigint;
  status: number;
}

export interface OpenPosition {
  agreement?: Agreement;
  pnlPercentage?: string;
  pnl?: string;
  isPnlLoading?: boolean;
  id?: bigint;
  quote?: bigint;
  type: ServiceName;
  name: string;
}
