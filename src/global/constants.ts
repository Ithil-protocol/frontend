import { BigNumber as BN } from '@ethersproject/bignumber';
import { Interface } from '@ethersproject/abi';
import Mocks from '@ithil-protocol/deployed/goerli/deployments/mocks.json';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';
import Vault from '@ithil-protocol/deployed/goerli/deployments/Vault.json';
import Liquidator from '@ithil-protocol/deployed/goerli/deployments/Liquidator.json';
import MTS from '@ithil-protocol/deployed/goerli/deployments/MarginTradingStrategy.json';
import YS from '@ithil-protocol/deployed/goerli/deployments/YearnStrategy.json';
import ES from '@ithil-protocol/deployed/goerli/deployments/EulerStrategy.json';
import VaultABI from '@ithil-protocol/deployed/goerli/abi/Vault.json';
import LiqudidatorABI from '@ithil-protocol/deployed/goerli/abi/Liquidator.json';
import MarginTradingStrategyABI from '@ithil-protocol/deployed/goerli/abi/MarginTradingStrategy.json';
import YearnStrategyABI from '@ithil-protocol/deployed/goerli/abi/YearnStrategy.json';
import EulerStrategyABI from '@ithil-protocol/deployed/goerli/abi/EulerStrategy.json';
import MockYearnRegistryABI from '@ithil-protocol/deployed/goerli/abi/MockYearnRegistry.json';

const abi = [
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function totalSupply() external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external returns (uint256)',
  'function mint() external',
];
export const ERC20ABI = new Interface(abi);

export const MOCKS = {
  MockYearnRegistry: {
    address: Mocks.mocks.MockYearnRegistry,
    abi: new Interface(MockYearnRegistryABI),
  },
};

export const { tokens: TOKEN_LIST } = TokenList;

export const CORE = {
  Vault: {
    address: Vault.address,
    abi: new Interface(VaultABI),
  },
  Liquidator: {
    address: Liquidator.address,
    abi: new Interface(LiqudidatorABI),
  },
};
export const STRATEGIES = {
  MarginTradingStrategy: {
    address: MTS.address,
    abi: new Interface(MarginTradingStrategyABI),
    defaultSlippage: '0.1',
  },
  YearnStrategy: {
    address: YS.address,
    abi: new Interface(YearnStrategyABI),
    defaultSlippage: '0.01',
  },
  EulerStrategy: {
    address: ES.address,
    abi: new Interface(EulerStrategyABI),
    defaultSlippage: '0.01',
  },
};
export const WEB_APP_URL = 'https://ithil.fi';
export const DOC_URL = 'https://docs.ithil.fi';
export const GITHUB_URL = 'https://github.com/Ithil-protocol';
export const DISCORD_URL = 'https://discord.gg/tEaGBcGdQC';

export const YEARN_API_URL =
  'https://cors-anywhere.herokuapp.com/https://api.yearn.finance/v1/';

export const TRADE_STRATEGIES = [
  {
    id: 1,
    title: 'Margin trading',
    description: 'Go long or short on any token pair via Kyber Network',
    apyMin: '0',
    apyMax: '∞x',
    risk: 'High',
    url: '/trade/margin-trading',
  },
  {
    id: 2,
    title: 'Yearn on steroids',
    description:
      'Stake your favorite token on any Yearn and earn vault and multiply your APY',
    apyMin: '5',
    apyMax: '20x',
    risk: 'Low',
    url: '/trade/yearn-strategy',
  },
  {
    id: 3,
    title: 'Battle in the Curve wars',
    description: 'Superfeed your harvests on Curve and Convex with leverage',
    apyMin: '10',
    apyMax: '100x',
    risk: 'Medium',
    url: '',
  },
];

export const MAX_LEVERAGE = 5;

export const DEFAULT_DEADLINE = '20';

export const POSITION_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0.3,
      borderWidth: 1,
    },
  },
  scales: {
    xAxis: {
      display: false,
    },
    yAxis: {
      display: false,
    },
  },
};

export const INIT_POSITION_VALUE = {
  id: '0',
  owedToken: TOKEN_LIST[0].address,
  heldToken: TOKEN_LIST[1].address,
  collateralToken: TOKEN_LIST[0].address,
  collateral: BN.from(0),
  principal: BN.from(0),
  allowance: BN.from(0),
  interestRate: BN.from(0),
  fees: BN.from(0),
  createdAt: BN.from(0),
};
