import { useEffect } from "react";
import { Address, useWaitForTransaction } from "wagmi";

import { useNotificationDialog } from "./useNotificationDialog";

export const useTransaction = (hash: Address, description: string) => {
  const notificationDialog = useNotificationDialog();
  const { isError, isLoading, isSuccess, isIdle, error, status } =
    useWaitForTransaction({
      hash: hash as Address,
    });
  useEffect(() => {
    if (isSuccess) {
      notificationDialog.openDialog({
        title: description,
        status: "success",
        duration: 5_000,
      });
    }
  }, [isSuccess, notificationDialog, description]);
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
  }, [description, error, isError, notificationDialog]);
  useEffect(() => {
    if (isLoading) {
      notificationDialog.openDialog({
        title: description,
        status: "loading",
        duration: 5_000,
      });
    }
  }, [description, notificationDialog, isLoading]);
  useEffect(() => {
    console.log("STATUS" + " " + status);
  }, [status]);
};
