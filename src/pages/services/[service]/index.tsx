import { useRouter } from "next/router";
import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { services } from "@/data/services";

const Service = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });
  const router = useRouter();

  const serviceName = router.query.service as string;

  useEffect(() => {
    if (!serviceName) return;

    const isServiceHasIndexPage = services.some(
      (i) => i.url === `/${serviceName}` && i.hasIndex
    );

    const { tokens = [] } = services.find((i) => i.name === serviceName) || {};

    if (isServiceHasIndexPage) tokenModal.openDialog(tokens, serviceName);
    else router.push("/404");
  }, [router, serviceName]);

  return <></>;
};

export default Service;
