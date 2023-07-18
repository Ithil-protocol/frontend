import { useContext, useEffect } from "react";

import TokenModal from "@/contexts/tokenModal";
import { getDefaultOptions } from "@/providers/tokenModal";
import { TokenModalOptions } from "@/types";

export const useTokenModal = (
  options: Partial<TokenModalOptions> = getDefaultOptions()
) => {
  const value = useContext(TokenModal);

  useEffect(() => {
    value.setOptions({
      ...getDefaultOptions(),
      ...options,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};
