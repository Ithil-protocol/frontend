import { StaticImageData } from "next/image";

import { ITokenName } from "@/types";

import iITHIL from "./iTokens/ITHIL.png";
import iDAI from "./iTokens/iDAI.png";
import iUSDC from "./iTokens/iUSDC.png";
import iUSDT from "./iTokens/iUSDT.png";
import iWBTC from "./iTokens/iWBTC.png";
import iWETH from "./iTokens/iWETH.png";

export const iTokenIcons: Record<ITokenName, StaticImageData> = {
  iDAI,
  iUSDC,
  iUSDT,
  iWBTC,
  iWETH,
  iITHIL,
};
