import { Button, ButtonProps } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const PrivateButton: React.FC<ButtonProps> = (props) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <>
      {isConnected ? (
        <Button {...props} />
      ) : (
        <Button mt={props.mt} onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default PrivateButton;
