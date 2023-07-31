import { useRouter } from "next/router";

import { ServiceName } from "@/types";
import { getSingleQueryParam } from "@/utils";

export const useServiceName = () => {
  const router = useRouter();

  const {
    query: { service: serviceName },
  } = router;

  const getServiceNameByUrl = () => {
    return router.pathname.split("/").at(-2) || "";
  };

  return (getSingleQueryParam(serviceName) ||
    getServiceNameByUrl()) as ServiceName;
};
