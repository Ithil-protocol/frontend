import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

export const stringInputToBigNumber = (input: string, decimals: number) => {
  if (input === '') {
    return BigNumber.from(0)
  }
  const mantissa = input.split('.')[1]
  if (mantissa && mantissa.length > decimals) return BigNumber.from(0)
  return parseUnits(input, decimals)
}
