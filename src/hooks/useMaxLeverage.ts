import BigNumber from 'bignumber.js';

import { useRiskFactor } from './useRiskFactor';
import { useBalance, useVaultData } from './useVault';

import { StrategyContractType } from '@/global/types';

export function useMaxLeverage(
  spentToken: string,
  obtainedToken: string,
  margin: BigNumber,
  strategy: StrategyContractType
) {
  const vaultData = useVaultData(spentToken);
  const balance: BigNumber = useBalance(spentToken);
  const riskFactor: BigNumber = useRiskFactor(strategy, obtainedToken);
  const netLoans: BigNumber = BigNumber(vaultData?.netLoans.toString());
  const baseFee: BigNumber = BigNumber(vaultData?.baseFee.toString());
  const insuranceReserveBalance: BigNumber = BigNumber(
    vaultData?.insuranceReserveBalance.toString()
  );

  const baseIR = baseFee.plus(
    netLoans
      .plus(BigNumber.max(netLoans.minus(insuranceReserveBalance), 0))
      .multipliedBy(riskFactor)
      .dividedBy(balance)
  );

  const maxLeverage = BigNumber('500').dividedBy(baseIR);
  console.log('maxLeverage', maxLeverage.toString());
  console.log(
    'altro',
    balance.minus(insuranceReserveBalance).dividedBy(margin).toString()
  );

  return BigNumber.max(
    BigNumber.min(
      maxLeverage,
      balance.minus(insuranceReserveBalance).dividedBy(margin)
    ),
    1
  ).toNumber();
}
