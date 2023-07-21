import { useDisclosure } from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";

import TokenModalComponent from "@/components/TokenModal";
import TokenModalContext from "@/contexts/tokenModal";
import { OpenTokenDialogFn, TokenModalOptions } from "@/types";

export const getDefaultOptions = () => ({
  isClosable: true,
  onSelectTokenCallback: () => undefined,
});

const TokenModal: React.FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setOptions] = useState<TokenModalOptions>(getDefaultOptions);
  const [serviceName, setServiceName] = useState("aave");

  const handleOpen: OpenTokenDialogFn = (sn = serviceName) => {
    setServiceName(sn);
    onOpen();
  };

  const handleSelectToken = () => {
    if (options.isClosable) {
      options.onSelectTokenCallback();
      onClose();
    }
  };

  return (
    <TokenModalContext.Provider
      value={{
        closeDialog: onClose,
        openDialog: handleOpen,
        setOptions,
        onSelectToken: handleSelectToken,
      }}
    >
      <TokenModalComponent
        isOpen={isOpen}
        serviceName={serviceName}
        onClose={onClose}
        onSelectToken={handleSelectToken}
      />

      {children}
    </TokenModalContext.Provider>
  );
};

export default TokenModal;
