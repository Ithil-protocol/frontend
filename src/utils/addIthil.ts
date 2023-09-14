import { Address } from "viem";
import { getWalletClient } from "wagmi/actions";

import { iTokenIcons } from "@/assets/imgs";
import contracts from "@/deploy/contracts.json";
import { Token } from "@/types/onchain.types";

export const ITHILToken: Token = {
  name: "ITHIL",
  coingeckoId: "ithil",
  iconName: "ithil",
  decimals: 18,
  tokenAddress: contracts.ithil as Address,
};

export const addTokenToWallet = async (token: Token) => {
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
