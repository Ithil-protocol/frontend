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
