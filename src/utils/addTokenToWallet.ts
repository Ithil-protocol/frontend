import { Address } from "viem";
import { getWalletClient } from "wagmi/actions";

import { iTokenIcons } from "@/assets/imgs";
import contracts from "@/deploy/contracts.json";
import { AssetEssential } from "@/types";

export const ITHILToken: AssetEssential = {
  name: "ITHIL",
  label: "ITHIL",
  coingeckoId: "ithil",
  iconName: "ithil",
  decimals: 18,
  tokenAddress: contracts.ithil as Address,
};

export const addTokenToWallet = async (token: AssetEssential) => {
  const walletClient = await getWalletClient();
  if (walletClient) {
    const imageUrl = window.location.origin + iTokenIcons["i" + token.name].src;
    await walletClient.watchAsset({
      type: "ERC20",
      options: {
        address: token.tokenAddress,
        decimals: token.decimals,
        symbol: token.name,
        image: imageUrl,
      },
    });
  }
};
