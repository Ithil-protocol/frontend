import { useRouter } from "next/router";
import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { services } from "@/data/services";
import { useServiceName } from "@/hooks/useServiceName";
import { getServiceByName } from "@/utils";

const Service = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });
  const router = useRouter();

  const serviceName = useServiceName();

  useEffect(() => {
    if (!serviceName) {
      pushTo404();
      return;
    }

    const isServiceHasIndexPage = services.some(
      (i) => i.url === `/${serviceName}` && i.hasIndex
    );

    const { tokens = [] } = getServiceByName(serviceName);

    if (isServiceHasIndexPage) tokenModal.openDialog(tokens, serviceName);
    else pushTo404();
  }, [router, serviceName]);

  const pushTo404 = () => router.push("/404");

  return <></>;
};

export default Service;
