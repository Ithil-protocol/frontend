import { encodeAbiParameters, parseAbiParameters, parseUnits } from "viem";
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

  const amount0 = shares ? multiplyBigInt(shares, 0.99) : 0n;

  const amount1 = currentPrice
    ? multiplyBigInt(
        multiplyBigInt(loanAmount, 2 ** (monthsLocked / 12)) / currentPrice,
        1 - Number(slippage)
      )
    : 0n;

  const collateral0: ServiceCollateral = {
    itemType: 0,
    token: vault?.vaultAddress as Address,
    identifier: 0n,
    amount: amount0,
  };
  const collateral1: ServiceCollateral = {
    itemType: 0,
    token: ithil.tokenAddress,
    identifier: 0n,
    amount: amount1,
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
