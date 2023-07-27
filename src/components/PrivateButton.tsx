import { Button, ButtonProps } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const PrivateButton: React.FC<ButtonProps> = (props) => {
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <Button {...props} />
      ) : (
        <ConnectButton chainStatus="full" />
      )}
    </>
  );
};

export default PrivateButton;
