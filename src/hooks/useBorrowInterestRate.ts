import { useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useVaultData } from './useVault';
import { useComputePairRiskFactor } from './useComputePairRiskFactor';

import { StrategyContractType } from '@/global/types';
import { CORE } from '@/global/constants';
import { baseInterestRate } from '@/global/utils';

export function useBorrowInterestRate(
  spentToken: string,
  obtainedToken: string,
  margin: BigNumber,
  borrowed: BigNumber,
  minObtained: BigNumber,
  strategy: StrategyContractType,
  collateralIsSpentToken: boolean
) {
  const vaultData = useVaultData(spentToken);
  const balance = useTokenBalance(spentToken, CORE.Vault.address);
  const dstBalanceNative = useTokenBalance(obtainedToken, strategy.address);
  const riskFactor: BigNumber = useComputePairRiskFactor(
    spentToken,
    obtainedToken,
    strategy
  );
  const netLoans: BigNumber = BigNumber(vaultData?.netLoans.toString());
  const baseFee: BigNumber = BigNumber(vaultData?.baseFee.toString());
  const dstBalance: BigNumber = BigNumber(dstBalanceNative?.toString() || 0);
  const insuranceReserveBalance: BigNumber = BigNumber(
    vaultData?.insuranceReserveBalance.toString()
  );

  const baseIR =
    borrowed.comparedTo(0) > 0
      ? baseInterestRate(
          baseFee,
          netLoans,
          insuranceReserveBalance,
          BigNumber(balance?.toString() || 0),
          riskFactor
        )
      : BigNumber(0);

  const amountIn = collateralIsSpentToken
    ? minObtained
    : minObtained.plus(margin);

  const numerator = amountIn.plus(dstBalance.multipliedBy(2));
  const denominator = numerator.plus(amountIn);
  const multiplier = numerator
    .multipliedBy(borrowed)
    .dividedBy(denominator.multipliedBy(margin))
    .toFixed(0);
  const borrowIR = baseIR.multipliedBy(multiplier);
  return borrowIR;
}
