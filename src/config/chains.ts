import type { Chain } from 'wagmi'
import { arbitrum } from 'wagmi/chains'

import { CoreInstance, coreConfig } from '@/config/env'

const anvilNetwork: Chain = {
  ...arbitrum,
  id: 1337,
  name: 'Localhost',
  network: 'localhost',
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
} as const

const carlinoNetwork: Chain = {
  ...arbitrum,
  id: 1337,
  name: 'carlino',
  network: 'carlino',
  rpcUrls: {
    default: { http: ['https://anvil.presso.coltre.lol'] },
    public: { http: ['https://anvil.presso.coltre.lol'] },
  },
}

// is the default network, either 127.0.0.1 or carlino or Arbitrum
// it varies depending on the environment
export const firstNetwork = (): Chain => {
  if (coreConfig.instance === 'dev') {
    return anvilNetwork
  }
  if (coreConfig.instance === 'private') {
    return carlinoNetwork
  }
  return anvilNetwork
}

export const addTestNetworks = async () => {
  if (coreConfig.instance === CoreInstance.PrivateTestnet || coreConfig.instance === CoreInstance.PublicTestnet) {
    try {
      const network = firstNetwork()
      if (window.ethereum == null) return
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId === '0x539') return

      await window.ethereum.request({
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
