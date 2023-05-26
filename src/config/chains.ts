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
  name: 'arbitrum-ithil',
  network: 'arbitrum-ithil',
  rpcUrls: {
    default: { http: ['https://rpc.vnet.tenderly.co/devnet/hardhat01/6e2d300f-b8d0-4d61-8fec-893e332a1d8a'] },
    public: { http: ['https://rpc.vnet.tenderly.co/devnet/hardhat01/6e2d300f-b8d0-4d61-8fec-893e332a1d8a'] },
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
  const network = firstNetwork()
  const hexChainId = '0x' + (42161).toString(16)
  if (coreConfig.instance === CoreInstance.PrivateTestnet) {
    try {
      if (window.ethereum == null) return
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId === hexChainId) return

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: hexChainId,
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
