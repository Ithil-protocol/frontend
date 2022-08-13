import { BigNumber as BN } from '@ethersproject/bignumber';
import AddressList from '@ithil-protocol/deployed/goerli/deployments/core.json';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';

export const GOERLI_ADDRESSES = AddressList;
export const TOKEN_LIST = TokenList;
export const WEB_APP_URL = 'https://ithil.fi';
export const DOC_URL = 'https://docs.ithil.fi';
export const GITHUB_URL = 'https://github.com/Ithil-protocol';
export const DISCORD_URL = 'https://discord.gg/tEaGBcGdQC';

export const TRADE_STRATEGIES = [
  {
    id: 1,
    title: 'Margin trading',
    description: 'Go long or short on any token pair',
    apyMin: '0',
    apyMax: '∞x',
    risk: 'High',
    url: '/trade/margin-trading',
  },
  {
    id: 2,
    title: 'Leveraged staking',
    description: 'Stake your favorite token and earn wealth',
    apyMin: '0',
    apyMax: '10x',
    risk: 'Low',
    url: '/trade/leveraged-staking',
  },
];

export const MAX_LEVERAGE = 5;

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
  owedToken: TOKEN_LIST.tokens[0].address,
  heldToken: TOKEN_LIST.tokens[1].address,
  collateralToken: TOKEN_LIST.tokens[0].address,
  collateral: BN.from(0),
  principal: BN.from(0),
  allowance: BN.from(0),
  interestRate: BN.from(0),
  fees: BN.from(0),
  createdAt: BN.from(0),
};
