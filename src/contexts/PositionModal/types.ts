import { ServiceName } from "@/types";

export interface Data {
  amount?: string;
  amountObtained?: string;
  collateral?: string;
  leverage?: string;
  lockTime?: string;
  position?: ServiceName;
  purchasePrice?: string;
  slippage?: string;
  token: string;
  wethReward?: string;
}
