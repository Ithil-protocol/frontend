import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { filterAssetByName, getServiceByName } from "@/utils";

const GMXPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("gmx").tokens;
    const filteredAssets = filterAssetByName(tokens);
    tokenModal.openDialog(filteredAssets, "gmx");
  }, []);

  return null;
};

export default GMXPage;
