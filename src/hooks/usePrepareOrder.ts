import Decimal from "decimal.js";
import {
  encodeAbiParameters,
  formatUnits,
  parseAbiParameters,
  parseUnits,
  toHex,
} from "viem";
import { type Address } from "wagmi";

import { ithil } from "@/data/ithil-token";
import { VaultName } from "@/types";
import { Token } from "@/types/onchain.types";
import { getVaultByTokenName, multiplyBigInt } from "@/utils";

import { useCallOptionCurrentPrice } from "./generated/callOption";
import { useVaultConvertToShares } from "./generated/vault";

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

interface PrepareDebitOrderProps {
  token: Token;
  collateralToken: Address;
  amount: string;
  leverage: string;
  interestAndSpread: bigint;
  extraData: Address;
}

export const usePrepareDebitOrder = ({
  token,
  collateralToken,
  amount,
  leverage,
  interestAndSpread,
  extraData,
}: PrepareDebitOrderProps) => {
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

interface PrepareCreditOrderProps {
  token: Token;
  amount: string;
  slippage: string;
  extraData: Address;
  monthsLocked: number;
}

export const usePrepareCreditOrder = ({
  token,
  amount,
  slippage,
  monthsLocked,
}: PrepareCreditOrderProps) => {
  const vault = getVaultByTokenName(token.name as VaultName);
  const loanAmount = parseUnits(amount, token.decimals);

  const { data: shares, isLoading: isSharesLoading } = useVaultConvertToShares({
    address: vault?.vaultAddress as Address,
    args: [loanAmount],
    enabled: !!vault?.vaultAddress,
  });

  const { data: currentPrice, isLoading: isCallOptionsLoading } =
    useCallOptionCurrentPrice();

  const currentPriceDecimal = new Decimal(formatUnits(currentPrice || 1n, 18));
  const sharesDecimal = new Decimal(shares?.toString() || "0");
  const loanDecimal = new Decimal(loanAmount.toString() || "0");
  const monthsLockedDecimal = new Decimal(monthsLocked);

  const amount0 = shares ? multiplyBigInt(shares, 0.99) : 0n;

  const amount0d = sharesDecimal.mul(new Decimal("0.99"));

  const amount1 = currentPrice
    ? multiplyBigInt(
        multiplyBigInt(loanAmount, 2 ** (monthsLocked / 12)) / currentPrice,
        1 - Number(slippage)
      )
    : 0n;

  const amount1d = loanDecimal
    .mul(new Decimal(2).pow(monthsLockedDecimal.div(new Decimal(12))))
    .div(currentPriceDecimal)
    .mul(new Decimal(1 - +slippage));

  const collateral0: ServiceCollateral = {
    itemType: 0,
    token: vault?.vaultAddress as Address,
    identifier: 0n,
    amount: BigInt(amount0d.floor().toString() || 0),
  };
  const collateral1: ServiceCollateral = {
    itemType: 0,
    token: ithil.tokenAddress,
    identifier: 0n,
    amount: BigInt(amount1d.floor().toString() || 0),
  };
  const loan: ServiceLoan = {
    token: token.tokenAddress,
    amount: loanAmount,
    margin: 0n,
    interestAndSpread: 0n,
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral0, collateral1],
    createdAt: BigInt(0),
    status: 0,
  };

  const order: IServiceOrder = {
    agreement,
    data: encodeAbiParameters(parseAbiParameters("uint256"), [
      BigInt(monthsLocked - 1),
    ]),
  };

  const isLoading = isSharesLoading || isCallOptionsLoading;

  return {
    order,
    isLoading,
  };
};

interface PrepareFixedYieldOrder {
  token: Token;
  amount: string;
}

export const usePrepareFixedYieldOrder = ({
  token,
  amount,
}: PrepareFixedYieldOrder) => {
  const loanAmount = parseUnits(amount, token.decimals);

  const vault = getVaultByTokenName(token.name as VaultName);

  const { data: shares, isLoading: isSharesLoading } = useVaultConvertToShares({
    address: vault?.vaultAddress as Address,
    args: [loanAmount],
    enabled: !!vault?.vaultAddress,
  });

  console.log("order33 - shares", shares);

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: vault?.vaultAddress as Address,
    identifier: 0n,
    amount: multiplyBigInt(shares || 0n, 0.99),
  };

  const loan: ServiceLoan = {
    token: token.tokenAddress,
    amount: loanAmount,
    margin: 0n,
    interestAndSpread: 0n,
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

  return {
    order,
    isLoading: isSharesLoading,
  };
};
