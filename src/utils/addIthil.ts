import { getWalletClient } from "wagmi/actions";

import contracts from "@/deploy/contracts.json";

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
