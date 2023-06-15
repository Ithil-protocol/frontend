import DAI from "cryptocurrency-icons/svg/icon/dai.svg";
import ETH from "cryptocurrency-icons/svg/icon/eth.svg";
import USDC from "cryptocurrency-icons/svg/icon/usdc.svg";
import USDT from "cryptocurrency-icons/svg/icon/usdt.svg";
import WBTC from "cryptocurrency-icons/svg/icon/wbtc.svg";

// for those icons that they are absent in the cryptocurrency-icons, just put them inside this path: "src/assets/svgs/icons/" and then import like this:
// import ARB from "@/assets/svgs/icons/Arbitrum.svg";

// the "keys" in icons object must match underlyingLabels or accountingLabels
// if underlyingLabel is TokenX we should add it in the object like this:
// TokenX: any-SVG-icon-file

export const icons = {
  WETH: ETH,
  USDC,
  DAI,
  WBTC,
  // ARB,
  USDT,
};
