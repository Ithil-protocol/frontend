import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { getServiceByName } from "@/utils";

const AavePage = () => {
  const tokenModal = useTokenModal();

  useEffect(() => {
    const tokens = getServiceByName("gmx").tokens;
    tokenModal.openDialog(tokens, "gmx");
  }, []);

  return null;
};

export default AavePage;
