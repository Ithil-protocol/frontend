import { ServiceName } from "@/types";

export interface Data {
  amount: string;
  collateral: string;
  leverage?: string;
  lockTime?: string;
  position: ServiceName;
  slippage?: string;
  token: string;
}
