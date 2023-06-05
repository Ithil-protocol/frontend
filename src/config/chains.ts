import type { Chain } from 'wagmi'
import { arbitrum } from 'wagmi/chains'

import { CoreInstance, coreConfig } from '@/config/env'
import contracts from '@/deploy/contracts.json'

const testNetwork: Chain = {
  ...arbitrum,
  name: 'arbitrum-ithil',
  network: 'arbitrum-ithil',
  rpcUrls: {
    default: { http: [contracts.networkUrl] },
    public: { http: [contracts.networkUrl] },
  },
}

// is the default network, either 127.0.0.1 or carlino or Arbitrum
// it varies depending on the environment
export const firstNetwork = (): Chain => {
  return testNetwork
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
