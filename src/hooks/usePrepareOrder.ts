import { parseUnits } from "viem";
import { type Address } from "wagmi";

import { Token } from "@/types/onchain.types";
import { multiplyBigInt } from "@/utils";

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

interface PrepareOrderProps {
  token: Token;
  collateralToken: Address;
  amount: string;
  leverage: string;
  interestAndSpread: bigint;
  extraData: Address;
}

export const usePrepareOrder = ({
  token,
  collateralToken,
  amount,
  leverage,
  interestAndSpread,
  extraData,
}: PrepareOrderProps) => {
  const bigintAmount = parseUnits(amount, token.decimals);

  const amountInLeverage = multiplyBigInt(bigintAmount, +leverage);

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
    data: extraData,
  };

  return {
    order,
  };
};
