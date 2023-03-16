import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'

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
export const bigNumberPercentage = (available: BigNumber | undefined, percentage: number, decimals: number): string => {
  const value = available ?? BigNumber.from(0)
  return formatUnits(value.mul(percentage).div(100), decimals)
}
