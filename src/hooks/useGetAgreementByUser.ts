import { useQuery } from "@tanstack/react-query";
import { Address, useAccount } from "wagmi";
import { readContract } from "wagmi/actions";

import { aaveABI } from "@/abi";
import contracts from "@/deploy/contracts.json";

import { useFixedYieldGetUserAgreements } from "./generated/fixedYield";
import { useGmxGetUserAgreements } from "./generated/gmx";

export const useGetAaveAgreementsByUser = () => {
  const { address: accountAddress } = useAccount();

  const getAaveAgreementOfUser = async () => {
    const aaveContractAddresses = contracts.aaveService;

    const allAaveAgreementContractRead = aaveContractAddresses.map(
      async (address) => {
        return readContract({
          address: address as Address,
          abi: aaveABI,
          functionName: "getUserAgreements",
          account: accountAddress,
        });
      }
    );
    const allAgreementsOfUser = await Promise.all(allAaveAgreementContractRead);
    const allAgreementsOfUserWithAddress = allAgreementsOfUser.flatMap(
      (contracts, i) => {
        return contracts[0].map((item, index) => {
          return {
            ...item,
            id: contracts[1][index],
            contractAddress: aaveContractAddresses[i] as Address,
          };
        });
      }
    );
    return allAgreementsOfUserWithAddress;
  };

  return useQuery({
    queryFn: getAaveAgreementOfUser,
    queryKey: [accountAddress, "getUserAgreements", "aave"],
    enabled: !!accountAddress,
  });
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
