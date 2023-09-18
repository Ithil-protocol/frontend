import { ServiceName } from "@/types";

export interface Data {
  amount?: string;
  amountObtained?: string;
  collateral?: string;
  formattedPnl?: string;
  leverage?: string;
  lockTime?: string;
  pnlColor?: string;
  pnlPercentage?: string;
  position?: ServiceName;
  purchasePrice?: string;
  slippage?: string;
  token: string;
  wethReward?: string;
  percentage?: number;
  type?: "open" | "close";
}
