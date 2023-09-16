import { ServiceName } from "@/types";

export interface Data {
  amount: string;
  leverage: string;
  position: ServiceName;
  slippage: string;
  token: string;
}
