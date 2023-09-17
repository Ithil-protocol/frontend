import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { filterAssetByName, getServiceByName } from "@/utils";

const CallOptionPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("call-option").tokens;
    const filteredAssets = filterAssetByName(tokens);
    tokenModal.openDialog(filteredAssets, "call-option");
  }, []);

  return null;
};

export default CallOptionPage;
