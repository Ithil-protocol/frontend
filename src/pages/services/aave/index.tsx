import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { getServiceByName } from "@/utils";

const AavePage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("aave").tokens;
    tokenModal.openDialog(tokens, "aave");
  }, []);

  return null;
};

export default AavePage;
