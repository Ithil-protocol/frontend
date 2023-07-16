import { SafetyScoreValue } from "@/utils";

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
export type ServiceType = "AAVE" | "GMX";
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
export interface Service {
  name: string;
  long_name: string;
  description: string;
  apyRange: string;
  bestApy: number;
  boostApy: number;
  tokens: string[];
  tvl: number;
  url: string;
  safety_score: SafetyScore;
  explanation: string;
}

export interface TRowTypes {
  token: string;
  amount: bigint;
  margin: bigint;
  createdAt: bigint | undefined;
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

export type OpenDialogFn = (o: OpenDialogFnOptions) => void;
export type CloseDialogFn = VoidNoArgs;
