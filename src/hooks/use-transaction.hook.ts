import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { type SendTransactionResult } from "@wagmi/core";
import { waitForTransaction } from "@wagmi/core";

import { useNotificationDialog } from "@/contexts/NotificationDialog";

interface EthersError extends Error {
  reason: string;
  method: string;
  transaction: {
    data: string;
    from: string;
    to: string;
  };
}

const isEthersError = (error: any): error is EthersError => {
  return (
    error != null &&
    typeof error === "object" &&
    "reason" in error &&
    "method" in error &&
    "transaction" in error
  );
};

export const useTransactionFeedback = () => {
  const addRecentTransaction = useAddRecentTransaction();
  const notificationDialog = useNotificationDialog();

  const trackTransaction = async (
    txResult: SendTransactionResult | undefined,
    description: string,
    pastTenseDescription?: string
  ) => {
    if (txResult === undefined) return;
    addRecentTransaction({
      hash: txResult.hash,
      description: pastTenseDescription ?? description,
    });

    notificationDialog.openLoading(description);

    await waitForTransaction({ hash: txResult.hash });

    notificationDialog.openSuccess(description);
  };

  const reportException = (error: Error | null) => {
    // ethers.js errors have special properties "reason", "method" and "transaction"
    const ethersError = isEthersError(error) ? error : null;
    const description =
      ethersError != null
        ? `method: ${ethersError.method} errored: ${ethersError.reason}`
        : "execution reverted";

    notificationDialog.openError(description, "Transaction failed");
  };

  return { trackTransaction, reportException };
};
