import { Button } from "@chakra-ui/react";

import { Asset } from "@/types";

interface Props {
  isConnected: boolean;
  isApproved: boolean;
  isButtonDisabled: boolean;
  isButtonLoading: boolean;
  approve: any;
  openPosition: any;
  asset: Asset;
  openConnectModal: (() => void) | undefined;
}

const SubmitButton: React.FC<Props> = ({
  approve,
  isApproved,
  isButtonDisabled,
  isButtonLoading,
  isConnected,
  openConnectModal,
  openPosition,
  asset,
}) => {
  return (
    <>
      {isConnected ? (
        <Button
          mt="20px"
          onClick={isApproved ? () => openPosition() : approve}
          isDisabled={isButtonDisabled}
          isLoading={isButtonLoading}
          loadingText={isButtonLoading ? "Waiting" : undefined}
        >
          {!asset
            ? "Loading..."
            : isApproved
            ? "Open position"
            : `Approve ${asset?.name}`}
        </Button>
      ) : (
        <Button mt="20px" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default SubmitButton;
