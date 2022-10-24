import { Interface } from '@ethersproject/abi';
import { Goerli, Localhost } from '@usedapp/core';

import {
  ContractType,
  PoolDetails,
  StrategyContractType,
  TokenDetails,
} from './types';
import BalancerPools from './pools.json';
import YearnRegisteryABI from './YearnRegistery.json';

const getIthilMocks = (chainName: string) => {
  try {
    return require(`@ithil-protocol/deployed/${chainName}/deployments/mocks.json`);
  } catch (error) {
    return {
      mocks: {
        MockKyberNetworkProxy: '0x818E6FECD516Ecc3849DAf6845e3EC868087B755',
        MockYearnRegistry: '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804',
      },
    };
  }
};

const getIthilBalancer = (chainName: string) => {
  try {
    return require(`@ithil-protocol/deployed/${chainName}/deployments/BalancerStrategy.json`);
  } catch (error) {
    return {
      address: '0xae91699D7D7E767Ce55E6ac255AB8Fe54E147295',
    };
  }
};

const getIthilBalancerABI = (chainName: string) => {
  try {
    return require(`@ithil-protocol/deployed/${chainName}/abi/BalancerStrategy.json`);
  } catch (error) {
    return [];
  }
};

const getIthilDeployed = (
  chainName: string
): {
  Mocks: any;
  TokenList: any;
  Vault: any;
  Liquidator: any;
  MTS: any;
  YS: any;
  BS: any;
  ES: any;
  VaultABI: any;
  LiqudidatorABI: any;
  MarginTradingStrategyABI: any;
  YearnStrategyABI: any;
  BalancerStrategyABI: any;
  EulerStrategyABI: any;
  BaseStrategyABI: any;
  MockYearnRegistryABI: any;
} => {
  return {
    Mocks: getIthilMocks(chainName),
    TokenList: require(`@ithil-protocol/deployed/${chainName}/deployments/tokenlist.json`),
    Vault: require(`@ithil-protocol/deployed/${chainName}/deployments/Vault.json`),
    Liquidator: require(`@ithil-protocol/deployed/${chainName}/deployments/Liquidator.json`),
    MTS: require(`@ithil-protocol/deployed/${chainName}/deployments/MarginTradingStrategy.json`),
    YS: require(`@ithil-protocol/deployed/${chainName}/deployments/YearnStrategy.json`),
    BS: getIthilBalancer(chainName),
    ES: require(`@ithil-protocol/deployed/${chainName}/deployments/EulerStrategy.json`),
    VaultABI: require(`@ithil-protocol/deployed/${chainName}/abi/Vault.json`),
    LiqudidatorABI: require(`@ithil-protocol/deployed/${chainName}/abi/Liquidator.json`),
    MarginTradingStrategyABI: require(`@ithil-protocol/deployed/${chainName}/abi/MarginTradingStrategy.json`),
    YearnStrategyABI: require(`@ithil-protocol/deployed/${chainName}/abi/YearnStrategy.json`),
    BalancerStrategyABI: getIthilBalancerABI(chainName),
    EulerStrategyABI: require(`@ithil-protocol/deployed/${chainName}/abi/EulerStrategy.json`),
    BaseStrategyABI: require(`@ithil-protocol/deployed/${chainName}/abi/BaseStrategy.json`),
    MockYearnRegistryABI: require(`@ithil-protocol/deployed/${chainName}/abi/MockYearnRegistry.json`),
  };
};

const getObjectFromArray = (array: any[2][]): { [key: string]: any } => {
  return Object.fromEntries(new Map(array));
};

const DEPLOYED_CHAINS = [
  { id: Goerli.chainId, deployed: getIthilDeployed('goerli') },
  { id: Localhost.chainId, deployed: getIthilDeployed('tenderly') },
];

export const MOCKS: {
  [chainId: number]: { [key: string]: ContractType };
} = getObjectFromArray(
  DEPLOYED_CHAINS.map((chain) => [
    chain.id,
    {
      MockYearnRegistry: {
        address: chain.deployed.Mocks.mocks.MockYearnRegistry,
        abi: new Interface(
          chain.id === 5
            ? chain.deployed.MockYearnRegistryABI
            : YearnRegisteryABI
        ),
      },
    },
  ])
);

export const TOKEN_LIST: {
  [chainId: number]: TokenDetails[];
} = getObjectFromArray(
  DEPLOYED_CHAINS.map((chain) => [chain.id, chain.deployed.TokenList.tokens])
);

export const CORE: { [chainId: number]: { [key: string]: ContractType } } =
  getObjectFromArray(
    DEPLOYED_CHAINS.map((chain) => [
      chain.id,
      {
        Vault: {
          address: chain.deployed.Vault.address,
          abi: new Interface(chain.deployed.VaultABI),
        },
        Liquidator: {
          address: chain.deployed.Liquidator.address,
          abi: new Interface(chain.deployed.LiqudidatorABI),
        },
      },
    ])
  );

export const STRATEGIES: {
  [chainId: string]: { [key: string]: StrategyContractType };
} = getObjectFromArray(
  DEPLOYED_CHAINS.map((chain) => [
    chain.id,
    {
      MarginTradingStrategy: {
        address: chain.deployed.MTS.address,
        abi: new Interface(chain.deployed.MarginTradingStrategyABI),
        defaultSlippage: '0.1',
        type: 'margin',
        label: 'Margin Trading',
      },
      YearnStrategy: {
        address: chain.deployed.YS.address,
        abi: new Interface(chain.deployed.YearnStrategyABI),
        defaultSlippage: '0.01',
        type: 'yearn',
        label: 'Yearn Strategy',
      },
      BalancerStrategy: {
        address: chain.deployed.BS.address,
        abi: new Interface(chain.deployed.BalancerStrategyABI),
        defaultSlippage: '0.01',
        type: 'balancer',
        label: 'Balancer Strategy',
      },
      EulerStrategy: {
        address: chain.deployed.ES.address,
        abi: new Interface(chain.deployed.EulerStrategyABI),
        defaultSlippage: '0.01',
        type: 'euler',
        label: 'Euler Strategy',
      },
    },
  ])
);

export const BASE_STRATEGY_ABI = new Interface(
  DEPLOYED_CHAINS[0].deployed.BaseStrategyABI
);

export const BALANCER_POOLS: PoolDetails[] = BalancerPools.map((pool) => ({
  name: pool.lpToken.name,
  decimals: 18,
  address: pool.lpToken.id,
  tokens: [TOKEN_LIST[Localhost.chainId][0], TOKEN_LIST[Localhost.chainId][4]],
}));
