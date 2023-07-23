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
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

import { CloseButton } from "@/assets/svgs";
import { placeHolderVaultData, useVaults } from "@/hooks/use-vaults.hook";
import { useColorMode } from "@/hooks/useColorMode";
import { VoidNoArgs } from "@/types";

import TokenIcon from "./TokenIcon";

interface Props {
  isOpen: boolean;
  onClose?: VoidNoArgs;
  onSelectToken?: () => void;
  serviceName: string;
  returnPath?: string;
}

const TokenModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectToken,
  returnPath,
  serviceName,
}) => {
  const { mode } = useColorMode();

  const handleClose = () => {
    if (onClose) onClose();
  };

  const { data: vaultData } = useVaults();
  const vaultDataWithFallback = vaultData ?? placeHolderVaultData;

  return (
    <>
      <ChakraModal onClose={handleClose} isCentered isOpen={isOpen}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={mode("primary.100", "primary.100.dark")}>
          <ModalHeader
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span></span>
            <span>Select a token</span>
            {onClose ? (
              <Text
                style={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                onClick={handleClose}
              >
                <CloseButton width={14} height={14} />
              </Text>
            ) : (
              <span></span>
            )}
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
            <List p="10px" bg="transparent">
              {vaultDataWithFallback
                .map((item) => {
                  const descriptions = {
                    USDC: "USD Coin",
                    USDT: "USD Tether",
                    WETH: "Wrapped Ether",
                    WBTC: "Wrapped BTC",
                  };

                  return {
                    ...item.token,
                    description:
                      descriptions[
                        item.token.name as keyof typeof descriptions
                      ],
                  };
                })
                .map((item, key) => (
                  <React.Fragment key={key}>
                    <Link
                      onClick={onSelectToken}
                      href={`/services/${serviceName}/${item.name.toLowerCase()}`}
                    >
                      <ListItem>
                        <Button
                          style={{
                            border: "0px",
                            display: "flex",
                            gap: "15px",
                            justifyContent: "flex-start",
                            padding: "30px",
                            width: "100%",
                          }}
                          variant="outline"
                        >
                          <div>
                            <TokenIcon
                              width={40}
                              height={40}
                              name={item.name}
                            />
                          </div>

                          <div
                            style={{
                              alignItems: "flex-start",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-start",
                            }}
                          >
                            <Text
                              fontWeight="medium"
                              color={mode(
                                "secondary.100",
                                "secondary.100.dark"
                              )}
                            >
                              {item.name}
                            </Text>
                            <Text
                              fontWeight="medium"
                              fontSize="md"
                              color={mode("primary.400.dark", "primary.400")}
                            >
                              {item.description}
                            </Text>
                          </div>
                        </Button>
                      </ListItem>
                    </Link>
                  </React.Fragment>
                ))}
            </List>
          </ModalBody>

          {returnPath && (
            <ModalFooter>
              <Link
                onClick={onClose}
                style={{ width: "100%" }}
                href={returnPath}
              >
                <Button>Back</Button>
              </Link>
            </ModalFooter>
          )}
        </ModalContent>
      </ChakraModal>
    </>
  );
};

export default TokenModal;
