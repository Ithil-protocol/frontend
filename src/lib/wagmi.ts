import { testNetwork } from "@/config/chains";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { queryClient } from "@/lib/react-query";
import { arbitrum } from "wagmi/dist/chains";

const networks : Record<string,Chain> = {
  mainnet:arbitrum,
  testnet:testNetwork
}

const network = networks[process.env.NEXT_PUBLIC_NETWORK!];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [network], // until Ithil is not a multi-chain app, we can use only one network
  [
    jsonRpcProvider({
      rpc: (_chain) => ({ http: testNetwork.rpcUrls.default.http[0] }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Ithil Core",
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
});

export const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  queryClient,
});

export {
  chains
}