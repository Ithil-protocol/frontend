import { useAccount } from "wagmi";

import { useAaveGetUserAgreements } from "./generated/aave";
import { useFixedYieldGetUserAgreements } from "./generated/fixedYield";
import { useGmxGetUserAgreements } from "./generated/gmx";

export const useGetAaveAgreementsByUser = () => {
  const { address } = useAccount();
  return useAaveGetUserAgreements({ account: address, enabled: !!address });
};
export const useGetGmxAgreementsByUser = () => {
  const { address } = useAccount();
  return useGmxGetUserAgreements({ account: address, enabled: !!address });
};
export const useGetFixedYieldAgreementsByUser = () => {
  const { address } = useAccount();
  return useFixedYieldGetUserAgreements({
    account: address,
    enabled: !!address,
  });
};
