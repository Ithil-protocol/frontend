import Rand from "rand-seed";

const utcNowDate = (): Date => {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    )
  );
};

/**
 *
 * @param seeds an array of strings to seed the random generator
 * @param maxIntegerLength size of the generated APY, e.g. 2 for 0.01 - 99.99%
 * @returns {number}
 */
export const fakeApy = (seeds: string[], maxIntegerLength = 2): number => {
  const utcDate = utcNowDate();
  const todayUtcString = utcDate.toISOString().slice(0, 10);
  const rand = new Rand(seeds.join("") + todayUtcString);
  const value = rand.next();

  const maxValue = 10 ** (maxIntegerLength + 2); // plus 2 because we want to have 2 decimals
  return Math.floor(value * maxValue) / 100; // 0.1 - 99.99%
};

/**
 *
 * @param seeds an array of strings to seed the random generator
 * @param maxTvlThousands 1 equals 1000$ tvl, or 10^4 $
 * @returns
 */
export const fakeTvl = (seeds: string[], maxTvlThousands?: number): number => {
  const utcDate = utcNowDate();
  const todayUtcString = utcDate.toISOString().slice(0, 10);
  const rand = new Rand(seeds.join("") + todayUtcString);
  const value = rand.next();

  const maxTvl = maxTvlThousands ?? 4; // 1M maximum
  const maxValue = 10 ** (maxTvl + 2); // 1_000_000 maximum
  // returns a value multiplied between 1k and 1M
  return Math.floor(value * maxValue);
};
