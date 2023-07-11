import { useAccount } from "wagmi";

import { useServiceGetUserAgreements } from "./generated/aave";

export const useGetAgreementsByUser = () => {
  const { address } = useAccount();
  return useServiceGetUserAgreements({ account: address, enabled: !!address });
};
