import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { convertNamesToAssets, getServiceByName } from "@/utils";

const FraxlendPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("fraxlend").tokens;
    const filteredAssets = convertNamesToAssets(tokens);

    tokenModal.openDialog(filteredAssets, "fraxlend");
  }, []);

  return null;
};

export default FraxlendPage;
