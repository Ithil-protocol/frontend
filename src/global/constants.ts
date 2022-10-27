import { BigNumber as BN } from '@ethersproject/bignumber';
import { Interface } from '@ethersproject/abi';

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

export const WEB_APP_URL = 'https://ithil.fi';
export const DOC_URL = 'https://docs.ithil.fi';
export const GITHUB_URL = 'https://github.com/Ithil-protocol';
export const DISCORD_URL = 'https://discord.gg/tEaGBcGdQC';

export const YEARN_API_URL = 'https://api.yearn.finance/v1/chains/1/vaults/all';

export const TENDERLY_RPC_API =
  'https://rpc.tenderly.co/fork/261f0c8d-5e1d-4797-bfb6-389820b020a6';

export const TRADE_STRATEGIES = [
  {
    id: 1,
    title: 'Margin trading',
    description: 'Go long or short on any token pair via Kyber Network',
    apyMin: '0',
    apyMax: '∞x',
    uRate: 15,
    risk: 5,
    url: '/trade/margin-trading',
  },
  {
    id: 2,
    title: 'Yearn on steroids',
    description:
      'Stake your favorite token on any Yearn and earn vault and multiply your APY',
    apyMin: '5',
    apyMax: '20x',
    uRate: 15,
    risk: 2,
    url: '/trade/yearn-strategy',
  },
  {
    id: 4,
    title: 'Join the veBAL revolution on Balancer',
    description: 'Balancer + Aura strategy',
    apyMin: '10',
    apyMax: '100x',
    risk: 'Medium',
    url: '/trade/balancer-aura-strategy',
  },
  {
    id: 3,
    title: 'Rest assured with Aave',
    description: 'Coming soon...',
    apyMin: '5',
    apyMax: '20x',
    uRate: 15,
    risk: 2,
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
  owedToken: '',
  heldToken: '',
  collateralToken: '',
  collateral: BN.from(0),
  principal: BN.from(0),
  allowance: BN.from(0),
  interestRate: BN.from(0),
  fees: BN.from(0),
  createdAt: BN.from(0),
};
