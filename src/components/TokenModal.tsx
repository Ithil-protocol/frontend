import {
  Button,
  Modal as ChakraModal,
  Divider,
  List,
  ListItem,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";

import { CloseButton } from "@/assets/svgs";
import { VoidNoArgs } from "@/types";
import { mode } from "@/utils/theme";

import TokenIcon from "./TokenIcon";

interface Props {
  isOpen: boolean;
  onClose: VoidNoArgs;
  modalFooter?: JSX.Element;
  onSelectToken: (tokenName: string) => void;
}
const TokenModal: React.FC<Props> = ({
  isOpen,
  modalFooter,
  onClose,
  onSelectToken,
}) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <ChakraModal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={mode(colorMode, "primary.100", "primary.100.dark")}>
          <ModalHeader
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span></span>
            <span>Select a token</span>
            <Text
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                padding: "8px",
              }}
              onClick={onClose}
            >
              <CloseButton width={14} height={14} />
            </Text>
          </ModalHeader>

          <Divider
            style={{
              width: "95%",
              alignSelf: "center",
            }}
          />

          <ModalBody
            style={{
              padding: "0px",
              paddingBottom: "0px",
            }}
          >
            <List p={"10px"} bg="transparent">
              {[
                {
                  title: "DAI",
                  description: "DAI Stablecoin",
                  tokenName: "dai",
                },
                {
                  description: "USD Coin",
                  tokenName: "usdc",
                  title: "USDC",
                },
                {
                  title: "LINK",
                  description: "ChainLink Token",
                  tokenName: "chain_link",
                },
                {
                  description: "Wrapped BTC",
                  tokenName: "wbtc",
                  title: "WBTC",
                },
                {
                  title: "WETH",
                  description: "Wrapped Ether",
                  tokenName: "weth",
                },
              ].map((item, key) => (
                <React.Fragment key={key}>
                  <ListItem>
                    <Button
                      onClick={() => onSelectToken(item.tokenName)}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "15px",
                        padding: "30px",
                        width: "100%",
                        border: "0px",
                      }}
                      variant="outline"
                    >
                      <div>
                        <TokenIcon
                          width={40}
                          height={40}
                          name={item.tokenName}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text
                          fontWeight={"medium"}
                          color={mode(
                            colorMode,
                            "secondary.100",
                            "secondary.100.dark"
                          )}
                        >
                          {item.title}
                        </Text>
                        <Text
                          fontWeight={"medium"}
                          fontSize={"md"}
                          color={mode(
                            colorMode,
                            "primary.400.dark",
                            "primary.400"
                          )}
                        >
                          {item.description}
                        </Text>
                      </div>
                    </Button>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </ModalBody>
          <ModalFooter>{modalFooter}</ModalFooter>
        </ModalContent>
      </ChakraModal>
    </>
  );
};

export default TokenModal;
