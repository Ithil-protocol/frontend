import {
  encodeAbiParameters,
  parseAbiParameters,
  parseUnits,
  toHex,
} from "viem";
import { type Address } from "wagmi";

import { useGmxRateAndSpread } from "@/hooks/useRateAndSpread";
import { Token } from "@/types/onchain.types";

interface ServiceLoan {
  token: Address;
  amount: bigint;
  margin: bigint;
  interestAndSpread: bigint;
}

interface ServiceCollateral {
  itemType: number;
  token: Address;
  identifier: bigint;
  amount: bigint;
}

export interface ServiceAgreement {
  loans: ServiceLoan[];
  collaterals: ServiceCollateral[];
  createdAt: bigint;
  status: number;
}

interface IServiceOrder {
  agreement: ServiceAgreement;
  data: Address;
}

const leverageConverter = (amount: bigint, leverage: number) => {
  const bigLeverage = BigInt(leverage * 100);
  const result = amount * bigLeverage;
  return result / BigInt(100);
};

export const usePrepareOrder = (
  token: Token,
  collateralToken: Address,
  amount: string,
  leverage: string,
  interestAndSpread: bigint
) => {
  const amountInLeverage = parseUnits(
    `${Number(amount) * Number(leverage)}`,
    token.decimals
  );
  const bigintAmount = parseUnits(amount, token.decimals);

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: collateralToken,
    identifier: BigInt(0),
    amount: bigintAmount + amountInLeverage,
  };
  const loan: ServiceLoan = {
    token: token.tokenAddress,
    amount: amountInLeverage,
    margin: bigintAmount,
    interestAndSpread,
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral],
    createdAt: BigInt(0),
    status: 0,
  };

  const order: IServiceOrder = {
    agreement,
    data: toHex(""),
  };

  console.log("ii", order);

  return {
    order,
  };
};

export const useGmxPrepareOrder = (
  token: Address,
  collateralToken: Address,
  amount: bigint,
  leverage: number
) => {
  const amountInLeverage = leverageConverter(amount, leverage);
  const {
    interestAndSpread,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
  } = useGmxRateAndSpread({
    tokenAddress: token,
    loan: amountInLeverage,
    margin: amount,
  });

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: collateralToken,
    identifier: BigInt(0),
    amount: amount + amountInLeverage,
  };
  const loan: ServiceLoan = {
    token,
    amount: amountInLeverage,
    margin: amount,
    interestAndSpread,
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral],
    createdAt: BigInt(0),
    status: 0,
  };

  const order: IServiceOrder = {
    agreement,
    data: encodeAbiParameters(parseAbiParameters("uint256"), [0n]),
  };

  return {
    order,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
  };
};
