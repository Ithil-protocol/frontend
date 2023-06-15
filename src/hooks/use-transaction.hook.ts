import { useToast } from "@chakra-ui/react";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { type SendTransactionResult } from "@wagmi/core";
import { waitForTransaction } from "@wagmi/core";

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
  const toast = useToast();

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
    const toastId = toast({
      title: description,
      status: "loading",
      duration: 30_000,
      isClosable: true,
    });

    await waitForTransaction({ hash: txResult.hash });
    toast.update(toastId, {
      title: description,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const reportException = (error: Error | null) => {
    // ethers.js errors have special properties "reason", "method" and "transaction"
    const ethersError = isEthersError(error) ? error : null;
    const description =
      ethersError != null
        ? `method: ${ethersError.method} errored: ${ethersError.reason}`
        : "execution reverted";
    toast({
      title: "Transaction failed",
      description,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return { trackTransaction, reportException };
};
