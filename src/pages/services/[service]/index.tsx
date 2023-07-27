import { useRouter } from "next/router";
import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import servicesJson from "@/data/services";
import tokens from "@/data/tokens.json";

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

    if (isServiceHasIndexPage) tokenModal.openDialog(tokens, serviceName);
    else router.push("/404");
  }, [router, serviceName, tokenModal]);

  return <></>;
};

export default Service;
