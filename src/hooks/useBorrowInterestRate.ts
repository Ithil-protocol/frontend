import { useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useRiskFactor } from './useRiskFactor';
import { useVaultData } from './useVault';

import { StrategyContractType } from '@/global/types';
import { CORE } from '@/global/constants';
import { baseInterestRate } from '@/global/utils';

export function useBorrowInterestRate(
  spentToken: string,
  obtainedToken: string,
  margin: BigNumber,
  borrowed: BigNumber,
  minObtained: BigNumber,
  strategy: StrategyContractType
) {
  const vaultData = useVaultData(spentToken);
  const balance = useTokenBalance(spentToken, CORE.Vault.address);
  const dstBalanceNative = useTokenBalance(obtainedToken, strategy.address);
  const riskFactor: BigNumber = useRiskFactor(strategy, obtainedToken);
  const netLoans: BigNumber = BigNumber(vaultData?.netLoans.toString());
  const baseFee: BigNumber = BigNumber(vaultData?.baseFee.toString());
  const dstBalance: BigNumber = BigNumber(dstBalanceNative?.toString() || 0);
  const insuranceReserveBalance: BigNumber = BigNumber(
    vaultData?.insuranceReserveBalance.toString()
  );

  const baseIR = baseInterestRate(
    baseFee,
    netLoans,
    insuranceReserveBalance,
    BigNumber(balance?.toString() || 0),
    borrowed,
    riskFactor
  );
  
  const leveragedAmount = borrowed.dividedBy(margin);
  const numerator = minObtained.plus(dstBalance.multipliedBy(2));
  const denominator = numerator.plus(minObtained);

  const borrowIR = baseIR.multipliedBy(leveragedAmount).multipliedBy(numerator).dividedBy(denominator);

  return borrowIR;
}
