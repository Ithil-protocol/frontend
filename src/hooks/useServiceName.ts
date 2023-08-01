import { useRouter } from "next/router";

import { ServiceName } from "@/types";

export const useServiceName = () => {
  const { asPath } = useRouter();
  const serviceName = asPath.split("/")[2] as ServiceName | undefined;

  return serviceName;
};
