import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { getServiceByName } from "@/utils";

const FixedYieldPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("fixed-yield").tokens;
    tokenModal.openDialog(tokens, "fixed-yield");
  }, []);

  return null;
};

export default FixedYieldPage;
