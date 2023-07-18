import { useAccount } from "wagmi";

import { useAaveGetUserAgreements } from "./generated/aave";
import { useGmxGetUserAgreements } from "./generated/gmx";

export const useGetAaveAgreementsByUser = () => {
  const { address } = useAccount();
  return useAaveGetUserAgreements({ account: address, enabled: !!address });
};
export const useGetGmxAgreementsByUser = () => {
  const { address } = useAccount();
  return useGmxGetUserAgreements({ account: address, enabled: !!address });
};
