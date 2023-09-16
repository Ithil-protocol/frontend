import { StaticImageData } from "next/image";

import iITHIL from "./iTokens/ITHIL.png";
import iDAI from "./iTokens/iDAI.png";
import iWBTC from "./iTokens/iDAI.png";
import iUSDC from "./iTokens/iUSDC.png";
import iUSDT from "./iTokens/iUSDT.png";
import iWETH from "./iTokens/iWETH.png";

export const iTokenIcons: Record<string, StaticImageData> = {
  iDAI,
  "iUSDC.e": iUSDC,
  iUSDT,
  iWBTC,
  iWETH,
  iITHIL,
};
