import { type JsonFragmentType, ParamType, defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { type Address } from 'wagmi'

const ServiceLoanComponents = [
  { internalType: 'address', name: 'token', type: 'address' },
  { internalType: 'uint256', name: 'amount', type: 'uint256' },
  { internalType: 'uint256', name: 'margin', type: 'uint256' },
  { internalType: 'uint256', name: 'interestAndSpread', type: 'uint256' },
]

interface ServiceLoan {
  token: Address
  amount: BigNumber
  margin: BigNumber
  interestAndSpread: BigNumber
}

const ServiceCollateralComponents = [
  { internalType: 'enum IService.ItemType', name: 'itemType', type: 'uint8' },
  { internalType: 'address', name: 'token', type: 'address' },
  { internalType: 'uint256', name: 'identifier', type: 'uint256' },
  { internalType: 'uint256', name: 'amount', type: 'uint256' },
]

interface ServiceCollateral {
  itemType: number
  token: Address
  identifier: BigNumber
  amount: BigNumber
}

const ServiceAgreementComponents: JsonFragmentType[] = [
  // Loan[] loans;
  { internalType: 'struct IService.Loan[]', name: 'loans', type: 'tuple[]', components: ServiceLoanComponents },
  // Collateral[] collaterals;
  {
    internalType: 'struct IService.Collateral[]',
    name: 'collaterals',
    type: 'tuple[]',
    components: ServiceCollateralComponents,
  },
  // uint256 createdAt;
  // Status status;
  { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
  { internalType: 'enum IService.Status', name: 'status', type: 'uint8' },
]

interface ServiceAgreement {
  loans: ServiceLoan[]
  collaterals: ServiceCollateral[]
  createdAt: BigNumber
  status: number
}

const ServiceOrderComponents = [
  { name: 'agreement', type: 'tuple', components: ServiceAgreementComponents },
  { internalType: 'bytes', name: 'data', type: 'bytes' },
]

interface IServiceOrder {
  agreement: ServiceAgreement
  data: Address
}

const ServiceOrderInput = [
  { internalType: 'struct IService.Order', name: 'order', type: 'tuple', components: ServiceOrderComponents },
]

const OpenOrder = [{ stateMutability: 'nonpayable', type: 'function', name: 'open', inputs: ServiceOrderInput }]

const QuoteOrder = [
  {
    name: 'quote',
    outputs: [
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        internalType: 'struct IService.Agreement',
        name: 'agreement',
        type: 'tuple',
        components: ServiceAgreementComponents,
      },
    ],
  },
]

export const serviceAbi = [...OpenOrder, ...QuoteOrder]

export const prepareOrder = (token: Address, amount: BigNumber, leverage: number) => {
  const amountInLeverage = amount.mul(2)

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: '0x625E7708f30cA75bfd92586e17077590C60eb4cD', // FIXME: this is Token address, but should be aToken address
    identifier: BigNumber.from(0),
    amount: amount.add(amountInLeverage),
  }
  const loan: ServiceLoan = {
    token,
    amount: amountInLeverage,
    margin: amount,
    interestAndSpread: BigNumber.from(0),
  }
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral],
    createdAt: BigNumber.from(0),
    status: 0,
  }

  const order: IServiceOrder = {
    agreement,
    data: hexlify([]) as `0x${string}`,
  }

  return order
}

export const decodeOrder = (order: string) => {
  const ServiceOrderParamType: ParamType[] = ServiceOrderInput.map((input) => ParamType.from(input))
  const decoded = defaultAbiCoder.decode(ServiceOrderParamType, order)
  return decoded
}

export const encodeOrder = (order: IServiceOrder) => {
  const ServiceOrderParamType: ParamType[] = ServiceOrderInput.map((input) => ParamType.from(input))

  const encoded = defaultAbiCoder.encode(ServiceOrderParamType, [order])
  return encoded
}
