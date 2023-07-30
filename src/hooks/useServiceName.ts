import { useRouter } from "next/router";

export const useServiceName = () => {
  const router = useRouter();

  const {
    query: { service: serviceName },
  } = router;

  const getServiceNameByUrl = () => {
    return router.pathname.split("/").at(-2) || "";
  };

  return (serviceName as string | undefined) || getServiceNameByUrl();
};
