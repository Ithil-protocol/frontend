import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { convertNamesToAssets, getServiceByName } from "@/utils";

const GMXPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("gmx").tokens;
    const filteredAssets = convertNamesToAssets(tokens);
    tokenModal.openDialog(filteredAssets, "gmx");
  }, []);

  return null;
};

export default GMXPage;
