import { getWalletClient } from "wagmi/actions";

import { iTokenIcons } from "@/assets/imgs";
import contracts from "@/deploy/contracts.json";
import { Token } from "@/types/onchain.types";

export const addIthilToWallet = async () => {
  const walletClient = await getWalletClient();
  if (walletClient) {
    await walletClient.watchAsset({
      type: "ERC20",
      options: {
        address: contracts.ithil,
        decimals: 18,
        symbol: "ITHIL",
        image:
          "https://raw.githubusercontent.com/Ithil-protocol/landing/master/src/assets/images/favicon-96x96.png",
      },
    });
  }
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
