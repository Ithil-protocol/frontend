import AddressList from '@ithil-protocol/deployed/goerli/deployments/core.json';

export const GOERLI_ADDRESSES = AddressList;

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
