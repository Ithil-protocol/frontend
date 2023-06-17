import { BigNumber } from "@ethersproject/bignumber";
import { hexlify } from "@ethersproject/bytes";
import { type Address } from "wagmi";

interface ServiceLoan {
  token: Address;
  amount: BigNumber;
  margin: BigNumber;
  interestAndSpread: BigNumber;
}

interface ServiceCollateral {
  itemType: number;
  token: Address;
  identifier: BigNumber;
  amount: BigNumber;
}

interface ServiceAgreement {
  loans: ServiceLoan[];
  collaterals: ServiceCollateral[];
  createdAt: BigNumber;
  status: number;
}

interface IServiceOrder {
  agreement: ServiceAgreement;
  data: Address;
}

export const prepareOrder = (
  token: Address,
  aToken: Address,
  amount: bigint,
  _leverage: number
) => {
  const amountInLeverage = amount.mul(2);

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: aToken,
    identifier: BigNumber.from(0),
    amount: amount.add(amountInLeverage),
  };
  const loan: ServiceLoan = {
    token,
    amount: amountInLeverage,
    margin: amount,
    interestAndSpread: BigNumber.from(0),
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral],
    createdAt: BigNumber.from(0),
    status: 0,
  };

  const order: IServiceOrder = {
    agreement,
    data: hexlify([]) as `0x${string}`,
  };

  return order;
};
