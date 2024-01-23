import Decimal from "decimal.js";
import { encodeAbiParameters, parseAbiParameters, parseUnits } from "viem";
import { type Address } from "wagmi";

import { ithil } from "@/data/other-asset";
import { Asset } from "@/types";
import { multiplyBigInt } from "@/utils";

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

interface PrepareAaveOrderProps {
  token: Asset;
  collateralToken: Address;
  amount: string;
  leverage: string;
  interestAndSpread: bigint;
  extraData: Address;
  slippage: string;
}

interface PrepareGmxOrderProps {
  token: Asset;
  collateralTokens: [Address, Address];
  amount: string;
  leverage: string;
  interestAndSpread: bigint;
  extraData: Address;
  slippage: string;
}

export const usePrepareAaveOrder = ({
  token,
  collateralToken,
  amount,
  leverage,
  interestAndSpread,
  extraData,
  slippage,
}: PrepareAaveOrderProps) => {
  const bigintAmount = parseUnits(amount, token.decimals);

  const amountInLeverage = multiplyBigInt(bigintAmount, +leverage);

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: collateralToken,
    identifier: BigInt(0),
    amount:
      ((bigintAmount + amountInLeverage) *
        BigInt(1000 - Number(slippage) * 1000)) /
      1000n,
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

export const usePrepareGmxOrder = ({
  token,
  collateralTokens,
  amount,
  leverage,
  interestAndSpread,
  extraData,
  slippage,
}: PrepareGmxOrderProps) => {
  const bigintAmount = parseUnits(amount, token.decimals);

  const amountInLeverage = multiplyBigInt(bigintAmount, +leverage);

  const collateralGlp: ServiceCollateral = {
    itemType: 0,
    token: collateralTokens[0],
    identifier: BigInt(0),
    amount:
      ((bigintAmount + amountInLeverage) *
        BigInt(1000 - Number(slippage) * 1000)) /
      1000n,
  };

  // TODO: implement USDG slippage
  const collateralUSDG: ServiceCollateral = {
    itemType: 0,
    token: collateralTokens[1],
    identifier: BigInt(0),
    amount: BigInt(1),
  };

  const loan: ServiceLoan = {
    token: token.tokenAddress,
    amount: amountInLeverage,
    margin: bigintAmount,
    interestAndSpread,
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateralGlp, collateralUSDG],
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
  asset: Asset;
  amount: string;
  amount1: Decimal;
  monthsLocked: number;
}

export const usePrepareCreditOrder = ({
  asset,
  amount,
  amount1,
  monthsLocked,
}: PrepareCreditOrderProps) => {
  const loanAmount = parseUnits(amount, asset.decimals);

  const { data: shares, isLoading: isSharesLoading } = useVaultConvertToShares({
    address: asset?.vaultAddress as Address,
    args: [loanAmount],
    enabled: !!asset?.vaultAddress,
  });

  const { isLoading: isCallOptionsLoading } = useCallOptionCurrentPrice();

  const sharesDecimal = new Decimal(shares?.toString() || "0");

  const amount0d = sharesDecimal.mul(new Decimal("0.99"));

  const amount1Num = amount1.floor().toNumber();

  const finalAmount1 =
    amount1.isNaN() || !amount1.isFinite() ? 0n : BigInt(amount1Num);

  const collateral0: ServiceCollateral = {
    itemType: 0,
    token: asset?.vaultAddress as Address,
    identifier: 0n,
    amount: BigInt(amount0d.floor().toString() || 0),
  };
  const collateral1: ServiceCollateral = {
    itemType: 0,
    token: ithil.tokenAddress,
    identifier: 0n,
    amount: finalAmount1,
  };
  const loan: ServiceLoan = {
    token: asset.tokenAddress,
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

  console.log("test11x", order);

  const isLoading = isSharesLoading || isCallOptionsLoading;

  return {
    order,
    isLoading,
  };
};

interface PrepareFixedYieldOrder {
  asset: Asset;
  amount: string;
}

export const usePrepareFixedYieldOrder = ({
  asset,
  amount,
}: PrepareFixedYieldOrder) => {
  const loanAmount = parseUnits(amount, asset.decimals);

  const { data: shares, isLoading: isSharesLoading } = useVaultConvertToShares({
    address: asset?.vaultAddress as Address,
    args: [loanAmount],
    enabled: !!asset?.vaultAddress,
  });

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: asset?.vaultAddress as Address,
    identifier: 0n,
    amount: multiplyBigInt(shares || 0n, 0.99),
  };

  const loan: ServiceLoan = {
    token: asset.tokenAddress,
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
    data: encodeAbiParameters(parseAbiParameters("uint256"), [0n]),
  };

  return {
    order,
    isLoading: isSharesLoading,
  };
};
