import { SafetyScoreValue } from "@/utils";

export const aaveService = {
  name: "Aave leveraged lending",
  description:
    "Optimize your capital allocation for max returns in one of the biggest and most secure over collateralized lending markets in DeFi",
  features: [
    { value: SafetyScoreValue.positive, text: "Battle-tested strategy" },
    { value: SafetyScoreValue.positive, text: "Low volatility assets" },
    {
      value: SafetyScoreValue.positive,
      text: "DeFi blue chip",
      extendedDescription:
        "Assets with Market Cap between 1M and 10M fall in this category",
    },
    {
      value: SafetyScoreValue.neutral,
      text: "Average returns",
      extendedDescription:
        "Impermanent Loss is a potential loss of value experienced by liquidity providers when the price of an asset in a liquidity pool diverges from its price in external markets.",
    },
  ],
  safetyScoreDescription:
    "By depositing your tokens on Aave, you contribute to a robust lending pool that serves borrowers across multiple chains, making it one of the most trusted and established DeFi protocols in the industry. Aave operates as a decentralized lending and borrowing platform, facilitating the lending of tokens by depositors and providing borrowers with access to these tokens. As a depositor, you earn a fee in return for lending your tokens to borrowers on the platform. This fee, which is derived from the interest paid by borrowers, serves as a source of income for you, boosting your overall APY. Aave's reputation for security and reliability is built on its extensive track record and adoption across various blockchain networks. With billions of dollars secured across more than five chains, Aave has consistently demonstrated its ability to safeguard user funds and maintain the integrity of its lending platform.",
  boostApy: 1,
};
