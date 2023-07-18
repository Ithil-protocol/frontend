import { useDisclosure } from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";

import TokenModalComponent from "@/components/TokenModal";
import TokenModalContext from "@/contexts/tokenModal";
import { TokenModalOptions } from "@/types";

export const getDefaultOptions = () => ({
  isClosable: true,
  onSelectTokenCallback: () => undefined,
});

const TokenModal: React.FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setOptions] = useState<TokenModalOptions>(getDefaultOptions);

  const handleOpen = () => {
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
        onClose={onClose}
        onSelectToken={handleSelectToken}
      />

      {children}
    </TokenModalContext.Provider>
  );
};

export default TokenModal;
