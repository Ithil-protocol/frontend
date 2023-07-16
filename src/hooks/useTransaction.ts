import { useEffect } from "react";
import { Address, useWaitForTransaction } from "wagmi";

import { useNotificationDialog } from "./useNotificationDialog";

export const useTransaction = (
  hash: Address | undefined,
  description: string
) => {
  const notificationDialog = useNotificationDialog();
  const { isError, isLoading, isSuccess, error } = useWaitForTransaction({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      notificationDialog.openDialog({
        title: description,
        status: "success",
        duration: 5_000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      notificationDialog.openDialog({
        title: error?.message
          ? error.message
          : "Somethings went wrong, please try again later.",
        status: "error",
        duration: 5_000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);
  useEffect(() => {
    if (isLoading) {
      notificationDialog.openDialog({
        title: description,
        status: "loading",
        duration: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
};
