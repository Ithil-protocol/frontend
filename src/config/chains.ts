import type { Chain } from 'wagmi'

export const anvilNetwork: Chain = {
  id: 1337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
} as const

export const tenderlyArbitrum: Chain = {
  id: 42161,
  name: 'TenderlyArbitrum',
  network: 'tenderly-arbitrum',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8228'], // FIXME: change to tenderly
    },
    public: {
      http: ['http://127.0.0.1:8228'],
    },
  },
}
