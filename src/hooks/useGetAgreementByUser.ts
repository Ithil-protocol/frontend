import { useAccount } from "wagmi";

import { useAaveGetUserAgreements } from "./generated/aave";

export const useGetAgreementsByUser = () => {
  const { address } = useAccount();
  return useAaveGetUserAgreements({ account: address, enabled: !!address });
};
