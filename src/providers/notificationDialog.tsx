import { useDisclosure } from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";

import NotificationDialog from "@/components/notificationDialog";
import NotificationDialogContext from "@/contexts/notificationDialog";
import { DialogOptions, OpenDialogFn } from "@/types";

const getDialogDefaultOptions = (): DialogOptions => ({
  message: "",
  status: "error",
  duration: 5000,
  isClosable: true,
});

const NotificationDialogProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>(
    getDialogDefaultOptions
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDialog: OpenDialogFn = (options) => {
    setDialogOptions({
      ...getDialogDefaultOptions(),
      ...options,
    });
    onOpen();
  };

  const closeDialog = () => {
    setDialogOptions(getDialogDefaultOptions());
    onClose();
  };

  return (
    <NotificationDialogContext.Provider
      value={{
        openDialog,
        closeDialog,
      }}
    >
      <NotificationDialog
        isOpen={isOpen}
        {...dialogOptions}
        onClose={closeDialog}
      />
      {children}
    </NotificationDialogContext.Provider>
  );
};

export default NotificationDialogProvider;
