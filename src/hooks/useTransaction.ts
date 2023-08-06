import { Address, useWaitForTransaction } from "wagmi";

import { useNotificationDialog } from "@/contexts/NotificationDialog";

export const useTransaction = (
  hash: Address | undefined,
  description: string
) => {
  const notificationDialog = useNotificationDialog();
  const { isError, isLoading, isSuccess, error } = useWaitForTransaction({
    hash,
  });

  // useEffect(() => {
  //   if (isSuccess) {
  //     notificationDialog.openSuccess(description);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccess]);
  // useEffect(() => {
  //   if (isError) {
  //     notificationDialog.openError(error?.message
  //         ? error.message
  //         : "Somethings went wrong, please try again later.",);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isError]);
  // useEffect(() => {
  //   if (isLoading) {
  //     notificationDialog.openLoading(description);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoading]);
};
