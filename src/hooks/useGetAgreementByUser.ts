import { useAccount } from "wagmi";

import { account } from "@/wagmiTest/config";

import { useServiceGetUserAgreements } from "./generated/service";

export const useGetAgreementsByUser = () => {
  const { address } = useAccount();
  return useServiceGetUserAgreements({ account: address, enabled: !!address });
};
