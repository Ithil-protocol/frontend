// assuming compounding daily
export const aprToApy = (apr: number) => {
  const dailyRate = Math.pow(1 + apr, 1 / 365) - 1;
  const apy = Math.pow(1 + dailyRate, 365) - 1;
  return apy;
};
