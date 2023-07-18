import { useDisclosure } from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";

import NotificationDialogModal from "@/components/notificationDialog";
import NotificationDialogContext from "@/contexts/notificationDialog";
import {
  CloseDialogFn,
  DialogOptions,
  OpenNotificationDialogFn,
} from "@/types";

const getDialogDefaultOptions = (): DialogOptions => ({
  description: "",
  duration: 5000,
  isClosable: true,
  status: "error",
  title: "",
});

const NotificationDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>(
    getDialogDefaultOptions
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDialog: OpenNotificationDialogFn = (options) => {
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
      <NotificationDialogModal
        isOpen={isOpen}
        {...dialogOptions}
        onClose={closeDialog}
      />
      {children}
    </NotificationDialogContext.Provider>
  );
};

export default NotificationDialog;
