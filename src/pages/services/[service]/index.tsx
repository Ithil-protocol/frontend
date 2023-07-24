import { useRouter } from "next/router";
import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import servicesJson from "@/data/services";

const Service = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });
  const router = useRouter();

  const serviceName = router.query.service as string;

  useEffect(() => {
    if (!serviceName) return;

    const isServiceHasIndexPage = servicesJson.some(
      (i) => i.url === `/${serviceName}` && i.hasIndex
    );

    if (isServiceHasIndexPage) tokenModal.openDialog(serviceName);
    else router.push("/404");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceName]);

  return <></>;
};

export default Service;
