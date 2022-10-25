import { ReactNode } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Interface } from '@ethersproject/abi';

export interface RouteType {
  path: string;
  component: ReactNode;
  title: string;
  isNavLinked: boolean;
}

export interface IBaseProps {
  className?: string | undefined;
}

export interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  logoURI?: string | undefined;
}

export interface PoolDetails {
  name: string;
  decimals: number;
  address: string;
  tokens: TokenDetails[];
  logoURI?: string | undefined;
}

export type IntervalType = '1d' | '1m' | '12m' | '60m';

export type PriorityType = 'buy' | 'sell';

/// @param spentToken the token we spend to enter the investment
/// @param obtainedToken the token obtained as result of the investment
/// @param collateral the amount of tokens to reserve as collateral
/// @param collateralIsSpentToken if true collateral is in spentToken,
//                                if false it is in obtainedToken
/// @param minObtained the min amount of obtainedToken to obtain
/// @param maxSpent the max amount of spentToken to spend
/// @param deadline this order must be executed before deadline

export interface OrderType {
  spentToken: string;
  obtainedToken: string;
  collateral: BigNumber;
  collateralIsSpentToken: boolean;
  minObtained: BigNumber;
  maxSpent: BigNumber;
  deadline: BigNumber;
}

/// @param owner the account who opened the position
/// @param owedToken the token which must be repayed to the vault
/// @param heldToken the token held in the strategy as investment effect
/// @param collateralToken the token used as collateral
/// @param collateral the amount of tokens used as collateral
/// @param principal the amount of borrowed tokens on which the interests are calculated
/// @param allowance the amount of heldToken obtained at the moment the position is opened
///                  (without reflections)
/// @param interestRate the interest rate paid on the loan
/// @param fees the fees generated by the position so far
/// @param createdAt the date and time in unix epoch when the position was opened

export interface PositionType {
  owedToken: string;
  heldToken: string;
  collateralToken: string;
  collateral: BigNumber;
  principal: BigNumber;
  allowance: BigNumber;
  interestRate: BigNumber;
  fees: BigNumber;
  createdAt: BigNumber;
}

export interface OpenedPositionType extends PositionType {
  id: string;
  type: string;
  label: string;
}

export interface ClosedPositionType extends PositionType {
  id: string;
  type: string;
  label: string;
  amountOut: string;
}

export type KeyableType = { [key: string]: string };

export type RedeemTokenInfoType = { address: string; id: string } | undefined;

export type PositionOpenType = 'active' | 'closed' | 'liquidated';

export type APIRequestMethodType = 'POST' | 'GET';

export type ContractType = {
  address: string;
  abi: Interface;
};

export interface StrategyContractType extends ContractType {
  defaultSlippage: string;
  type: string;
  label: string;
}
