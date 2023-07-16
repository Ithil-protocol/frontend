import { useDisclosure } from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";

import NotificationDialog from "@/components/notificationDialog";
import NotificationDialogContext from "@/contexts/notificationDialog";
import { CloseDialogFn, DialogOptions, OpenDialogFn } from "@/types";

const getDialogDefaultOptions = (): DialogOptions => ({
  description: "",
  duration: 5000,
  isClosable: true,
  status: "error",
  title: "",
});

const NotificationDialogProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>(
    getDialogDefaultOptions
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDialog: OpenDialogFn = (options) => {
    const newOptions = {
      ...getDialogDefaultOptions(),
      ...options,
    };

    setDialogOptions(newOptions);
    onOpen();

    if (newOptions.isClosable && newOptions.duration)
      setTimeout(() => {
        closeDialog();
      }, newOptions.duration);
  };

  const closeDialog: CloseDialogFn = () => {
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
