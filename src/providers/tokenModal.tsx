import { useDisclosure } from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";

import TokenModalComponent from "@/components/TokenModal";
import TokenModalContext from "@/contexts/tokenModal";
import { OpenTokenDialogFn, TokenModalOptions } from "@/types";

export const getDefaultOptions = (): TokenModalOptions => ({
  isClosable: true,
  onSelectTokenCallback: () => undefined,
  returnPath: "",
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
      handleClose();
    }
  };

  const handleClose = () => {
    setOptions(getDefaultOptions());
    onClose();
  };

  return (
    <TokenModalContext.Provider
      value={{
        closeDialog: handleClose,
        openDialog: handleOpen,
        setOptions,
        onSelectToken: handleSelectToken,
      }}
    >
      <TokenModalComponent
        isOpen={isOpen}
        serviceName={serviceName}
        onClose={handleClose}
        onSelectToken={handleSelectToken}
        returnPath={options.returnPath}
      />

      {children}
    </TokenModalContext.Provider>
  );
};

export default TokenModal;
