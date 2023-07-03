import { Button } from "@chakra-ui/react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

import { PromiseVoidNoArgs } from "@/types";

interface Props {
  shouldChangeNetwork: boolean;
  switchToTestNetwork: PromiseVoidNoArgs;
}

export const ConnectButton: React.FC<Props> = ({
  shouldChangeNetwork,
  switchToTestNetwork,
}) => {
  return (
    <>
      {shouldChangeNetwork ? (
        <Button onClick={switchToTestNetwork}>change network</Button>
      ) : (
        <RainbowConnectButton chainStatus="full" />
      )}
    </>
  );
};

export default ConnectButton;
