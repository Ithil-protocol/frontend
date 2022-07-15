import { Goerli, useEthers } from '@usedapp/core';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import MarginTradingStrategyABI from '@ithil-protocol/deployed/goerli/abi/MarginTradingStrategy.json';
import toast from 'react-hot-toast';

import { GOERLI_ADDRESSES } from '@/global/constants';

export default function useEstimateGas() {
  const { library } = useEthers();
  const abi = new Interface(MarginTradingStrategyABI);

  const estimateOpenPosition = async (...args: any[]) => {
    if (!library) return 0;
    const contract = new Contract(
      GOERLI_ADDRESSES.MarginTradingStrategy,
      abi,
      library.getSigner()
    );
    try {
      const estimatedGas = await contract.estimateGas.openPosition(...args);
      return estimatedGas.add('10000');
    } catch (error) {
      console.log(error);
      // toast.error((error as any).data.message);
      return 0;
    }
  };

  return { estimateOpenPosition };
}
