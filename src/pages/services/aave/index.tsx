import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { filterAssetByName, getServiceByName } from "@/utils";

const AavePage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("aave").tokens;
    const filteredAssets = filterAssetByName(tokens);

    tokenModal.openDialog(filteredAssets, "aave");
  }, []);

  return null;
};

export default AavePage;
