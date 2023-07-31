import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { getServiceByName } from "@/utils";

const AavePage = () => {
  const tokenModal = useTokenModal();

  useEffect(() => {
    const tokens = getServiceByName("call-option").tokens;
    tokenModal.openDialog(tokens, "call-option");
  }, []);

  return null;
};

export default AavePage;
