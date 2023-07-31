import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { getServiceByName } from "@/utils";

const AavePage = () => {
  const tokenModal = useTokenModal();

  useEffect(() => {
    const tokens = getServiceByName("fixed-yield").tokens;
    tokenModal.openDialog(tokens, "fixed-yield");
  }, []);

  return null;
};

export default AavePage;
