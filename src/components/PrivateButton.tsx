import { Button, ButtonProps } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { VoidNoArgs } from "@/types";

interface Props extends ButtonProps {
  approve?: VoidNoArgs;
  assetName?: string;
  isApproved?: boolean;
  openPosition?: VoidNoArgs;
  text?: string;
}

const PrivateButton: React.FC<Props> = ({
  approve,
  assetName = "",
  isApproved,
  isDisabled,
  isLoading,
  onClick,
  openPosition,
  text = "Open position",
  ...rest
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const children = !assetName
    ? "Loading..."
    : isApproved
    ? text
    : `Approve ${assetName}`;

  return (
    <>
      {isConnected ? (
        <Button
          {...rest}
          mt="20px"
          onClick={(isApproved ? openPosition : approve) || onClick}
          isDisabled={isDisabled}
          isLoading={isLoading}
          loadingText={isLoading && "Waiting"}
        >
          {children}
        </Button>
      ) : (
        <Button mt="20px" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default PrivateButton;
