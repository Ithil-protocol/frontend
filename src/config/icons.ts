import CHAIN_LINK from "cryptocurrency-icons/svg/color/chain.svg";
import DAI from "cryptocurrency-icons/svg/color/dai.svg";
import ETH from "cryptocurrency-icons/svg/color/eth.svg";
import USDC from "cryptocurrency-icons/svg/color/usdc.svg";
import USDT from "cryptocurrency-icons/svg/color/usdt.svg";
import WBTC from "cryptocurrency-icons/svg/color/wbtc.svg";

// for those icons that they are absent in the cryptocurrency-icons, just put them inside this path: "src/assets/svgs/icons/" and then import like this:
// import ARB from "@/assets/svgs/icons/Arbitrum.svg";

// the "keys" in icons object must match underlyingLabels or accountingLabels
// if underlyingLabel is TokenX we should add it in the object like this:
// TokenX: any-SVG-icon-file

export const icons = {
  CHAIN_LINK,
  DAI,
  USDC,
  // ARB,
  USDT,
  WBTC,
  WETH: ETH,
};
