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

export type VaultName = "USDC" | "USDT" | "WETH" | "WBTC";
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
  tokens: string[];
  tvl: number;
  url: string;
  safety_score: SafetyScore;
  explanation: string;
  type: "debit" | "credit";
}

export interface TRowTypes {
  token: Address;
  amount: bigint;
  margin: string | number;
  createdAt: bigint | undefined;
  type: string;
}

export interface PageHeading {
  pathName: string;
  heading: string;
}

export type DialogStatus = "error" | "warning" | "success" | "info" | "loading";

export interface DialogOptions {
  status: DialogStatus;
  title: string;
  description: string;
  duration: number;
  isClosable: boolean;
}

export interface OpenDialogFnOptions
  extends Omit<
    DialogOptions,
    "duration" | "description" | "isClosable" | "status"
  > {
  duration?: number;
  status?: DialogStatus;
  isClosable?: boolean;
  description?: string;
}

export type OpenNotificationDialogFn = (o: OpenDialogFnOptions) => void;
export type CloseDialogFn = VoidNoArgs;

export type OpenTokenDialogFn = (
  tokens: string[],
  serviceName: ServiceName
) => void;
export interface TokenModalOptions {
  tokens: string[];
  isClosable: boolean;
  onSelectTokenCallback: () => void;
  returnPath: string;
}

export type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type Asset = {
  name: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: Address;
  oracleAddress: Address;
  vaultAddress: Address;
  callOptionAddress: Address;
  aaveCollateralTokenAddress: Address;
  gmxCollateralTokenAddress: Address;
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
  type: string;
  name: string;
}
