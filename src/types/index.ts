import { Address } from "viem";

import { SafetyScoreValue, getServiceNames } from "@/utils";

export type viewTypes = "Active" | "Closed";

export type VoidNoArgs = () => void;

export type PromiseVoidNoArgs = () => Promise<void>;

export interface PositionsDetailItemType {
  title: string;
  value: string | number | string[] | number[];
  prefix?: string;
  postfix?: string | string[];
  postfixIcon?: React.ReactElement | React.ReactElement[];
  postfixStyle?: React.CSSProperties;
  prefixStyle?: React.CSSProperties;
}

export interface ChartDataPoint {
  date: Date;
  tvl: number;
  apy: number;
}

export type AssetName =
  | "USDC"
  | "USDT"
  | "WETH"
  | "WBTC"
  | "DAI"
  | "ITHIL"
  | "FRAX";

export type ITokenName = `i${AssetName}`;

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
  name: AssetName;
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

export type AssetEssential = Pick<
  Asset,
  "name" | "label" | "decimals" | "tokenAddress" | "coingeckoId" | "iconName"
>;

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
  leverage: string | undefined;
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

export type Vault = {
  token: Asset;
  tvl?: bigint;
  borrowed?: bigint;
  deposited?: bigint;
  apy?: string;
};

export type Vaults = Vault[];

export interface PositionData {
  aCollateral?: string;
  amount?: string;
  amountObtained?: string;
  assetLabel?: string;
  assetName?: AssetName;
  collateral?: string;
  formattedPnl?: string;
  gmxCollateral?: string;
  ithilObtained?: string;
  leverage?: string;
  margin?: string;
  maturityDate?: string;
  notionalPercentage?: string;
  percentage?: string;
  pnlColor?: string;
  pnlPercentage?: string;
  position?: ServiceName;
  purchasePrice?: string;
  redeemPrice?: string;
  serviceName?: ServiceName;
  slippage?: string;
  submitAlertText?: string | React.ReactElement;
  type?: "open" | "close";
  wethReward?: string;
}
