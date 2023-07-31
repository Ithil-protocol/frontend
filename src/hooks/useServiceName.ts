import { useRouter } from "next/router";

import { ServiceName } from "@/types";
import { getServiceNames, getSingleQueryParam } from "@/utils";

export const useServiceName = () => {
  const router = useRouter();

  const {
    query: { service: serviceName },
  } = router;

  const normalizedServiceName = getSingleQueryParam(serviceName);

  const getServiceNameByUrl = (): ServiceName | "" => {
    if (typeof window === "undefined") return "";

    const queries = history.state.as.split("/").filter(Boolean);

    for (const query of queries) {
      if (isQueryExistInServiceNames(query)) return query;
    }

    return "";
  };

  const isQueryExistInServiceNames = (query: string) =>
    getServiceNames().includes(query as ServiceName);

  return isQueryExistInServiceNames(normalizedServiceName)
    ? (normalizedServiceName as ServiceName)
    : getServiceNameByUrl();
};
