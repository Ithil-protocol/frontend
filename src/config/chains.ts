import type { Chain } from 'wagmi'

import { CoreInstance, coreConfig } from '@/config/env'

const anvilNetwork: Chain = {
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

const carlinoNetwork: Chain = {
  id: 1337,
  name: 'carlino',
  network: 'carlino',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://anvil.presso.coltre.lol'] },
    public: { http: ['https://anvil.presso.coltre.lol'] },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
}

// is the default network, either 127.0.0.1 or carlino or Arbitrum
// it varies depending on the environment
export const firstNetwork = () => {
  if (coreConfig.instance === 'dev') {
    return anvilNetwork
  }
  if (coreConfig.instance === 'private') {
    return carlinoNetwork
  }
  return anvilNetwork
}

export const addTestNetworks = () => {
  if (coreConfig.instance === CoreInstance.PrivateTestnet || coreConfig.instance === CoreInstance.PublicTestnet) {
    try {
      const network = firstNetwork()
      void window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x539',
            rpcUrls: [network.rpcUrls.default.http[0]],
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
          },
        ],
      })
    } catch (error) {
      console.log(error)
    }
  }
}
