import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { convertNamesToAssets, getServiceByName } from "@/utils";

const AavePage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("aave").tokens;
    const filteredAssets = convertNamesToAssets(tokens);

    tokenModal.openDialog(filteredAssets, "aave");
  }, []);

  return null;
};

export default AavePage;
