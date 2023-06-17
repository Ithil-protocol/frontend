import { format, parse } from "numerable";
import { formatUnits, parseUnits } from "viem";

export const stringInputToBigNumber = (input: string, decimals: number) => {
  if (input === "") {
    return BigInt(0);
  }
  const mantissa = input.split(".")[1];
  if (mantissa !== undefined && mantissa.length > decimals)
    // wrong calculation
    return BigInt(0); // wrong calculation
  const num = Number(input);
  return parseUnits(`${num}`, decimals);
};

/**
 * @param percentage between 0 and 100
 */
export const bigNumberPercentage = (
  available: bigint | undefined,
  percentage: number
): bigint => {
  const value = available ?? BigInt(0);
  return (value * BigInt(percentage)) / BigInt(100);
};

export const abbreviateBigNumber = (
  value: bigint | undefined,
  decimals: number
): string => {
  const v = value ?? BigInt(0);
  return format(parse(formatUnits(v, decimals)), "0.00a");
};

export const estimateTokenValue = (
  amount: bigint | undefined,
  decimals: number,
  price: number | undefined
): string => {
  const v = amount ?? BigInt(0);
  const p = price ?? BigInt(1);

  const amountBigInt = v;

  // build a BigInt from the price
  const priceDecimals = (p.toString().split(".")[1] ?? "").length;
  const integerPrice = p.toString().replace(/\./, "");
  const priceBigInt = BigInt(integerPrice);

  const value =
    (amountBigInt * priceBigInt) / BigInt(Math.pow(10, priceDecimals));
  return abbreviateBigNumber(value, decimals);
};

export const oneUnitWithDecimals = (decimals: number): bigint =>
  BigInt("1" + "0".repeat(decimals));

export const multiplyBigNumbers = (
  a: bigint | undefined,
  b: bigint | undefined,
  decimals: number
): bigint => {
  const aBN = a ?? BigInt(0);
  const bBN = b ?? BigInt(0);
  const one = oneUnitWithDecimals(decimals);
  return (aBN * bBN) / one;
};
