import { Address, useContractReads } from "wagmi";

import ServiceAbi from "@/abi/Service.abi";

import { serviceAddress } from "./generated/service";
import { useGetAgreementsByUser } from "./useGetAgreementByUser";

export const useOpenPositions = () => {
  const { data } = useGetAgreementsByUser();

  const openPositions = [];

  console.log("serviceAddress[42161]", serviceAddress[42161]);

  const { data: quotes } = useContractReads({
    contracts: [
      //@ts-ignore
      data?.[0]?.map((agreement) => ({
        abi: ServiceAbi,
        address: "0x9F1C69E1874d44Ad4ce79079C0b7Bd35E7882Ba8" as Address,
        functionName: "quote",
        args: [agreement],
      })),
    ],
    enabled: false,
  });

  // const { data: fees } = useContractReads({
  //   contracts: [
  //     //@ts-ignore
  //     data?.[0]?.map((agreement) => ({
  //       abi: ServiceAbi,
  //       address: serviceAddress[42161] as Address,
  //       functionName: "computeDueFees",
  //       args: [agreement],
  //     })),
  //   ],
  //   enabled: !!data,
  // });

  // console.log("test888 quotes", quotes);
  // console.log("test888 fees", fees);
};
