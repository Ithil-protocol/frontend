import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { testNetwork } from "@/config/chains";
import contracts from "@/deploy/contracts.json";

export const sendETHtoDeployer = async () => {
  const account = privateKeyToAccount(
    "0x02b24c18e5e904e0a83d41d5ac8ec177d6072be4870f2c707005f1f0875f6ca5"
  );

  const client = createWalletClient({
    account,
    chain: testNetwork,
    transport: http(contracts.networkUrl),
  });
  await client.sendTransaction({
    to: "0x7778f7b568023379697451da178326D27682ADb8",
    value: parseEther("0.0001"),
    chain: testNetwork,
  });
};
