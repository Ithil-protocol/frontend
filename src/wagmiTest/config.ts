import { Account, createPublicClient, http } from "viem";

import { testNetwork } from "@/config/chains";

// JSON-RPC Account
export const [account]: [Account] = [
  "0xed7E824e52858de72208c5b9834c18273Ebb9D3b",
] as unknown as [Account];
// Local Account
// export const account = privateKeyToAccount(...)

export const publicClient = createPublicClient({
  chain: testNetwork,
  transport: http(),
});
