import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { filterAssetByName, getServiceByName } from "@/utils";

const FixedYieldPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("fixed-yield").tokens;
    const filteredAssets = filterAssetByName(tokens);
    tokenModal.openDialog(filteredAssets, "fixed-yield");
  }, []);

  return null;
};

export default FixedYieldPage;
