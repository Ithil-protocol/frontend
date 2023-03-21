import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'
import numeral from 'numeral'

export const stringInputToBigNumber = (input: string, decimals: number) => {
  if (input === '') {
    return BigNumber.from(0)
  }
  const mantissa = input.split('.')[1]
  if (mantissa && mantissa.length > decimals) return BigNumber.from(0)
  return parseUnits(input, decimals)
}

/**
 * @param percentage between 0 and 100
 */
export const bigNumberPercentage = (available: BigNumber | undefined, percentage: number): BigNumber => {
  const value = available ?? BigNumber.from(0)
  return value.mul(percentage).div(100)
}

export const abbreviateBigNumber = (value: BigNumberish | undefined, decimals: number): string => {
  const v = value ?? BigNumber.from(0)
  return numeral(formatUnits(v, decimals)).format('0.00a')
}

export const estimateTokenValue = (
  amount: BigNumber | undefined,
  decimals: number,
  price: number | undefined,
): string => {
  const v = amount ?? BigNumber.from(0)
  const p = price ?? 0

  const amountBigInt = v.toBigInt()

  // build a BigInt from the price
  const priceDecimals = (p.toString().split('.')[1] || '').length
  const integerPrice = p.toString().replace(/\./, '')
  const priceBigInt = BigInt(integerPrice)

  const value = (amountBigInt * priceBigInt) / BigInt(Math.pow(10, priceDecimals))
  return abbreviateBigNumber(value, decimals)
}

export const oneUnitWithDecimals = (decimals: number): BigNumber => BigNumber.from('1' + '0'.repeat(decimals))
export const multiplyBigNumbers = (a: BigNumber | undefined, b: BigNumber | undefined, decimals: number): BigNumber => {
  const aBN = a ?? BigNumber.from(0)
  const bBN = b ?? BigNumber.from(0)
  const one = oneUnitWithDecimals(decimals)
  return aBN.mul(bBN).div(one)
}
