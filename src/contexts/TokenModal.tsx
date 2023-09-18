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
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import React from "react";

import { CloseButton } from "@/assets/svgs";
import TokenIcon from "@/components/TokenIcon";
import { useColorMode } from "@/hooks/useColorMode";
import {
  Asset,
  CloseDialogFn,
  OpenTokenDialogFn,
  ServiceName,
  TokenModalOptions,
  VoidNoArgs,
} from "@/types";

const TokenModalContext = createContext<{
  closeDialog: CloseDialogFn;
  onSelectToken: CloseDialogFn;
  openDialog: OpenTokenDialogFn;
  setOptions: (o: TokenModalOptions) => void;
  assets: Asset[];
}>({
  closeDialog: () => undefined,
  onSelectToken: () => undefined,
  openDialog: () => undefined,
  setOptions: () => undefined,
  assets: [],
});

export const useTokenModal = (
  options: Partial<TokenModalOptions> = getDefaultOptions()
) => {
  const value = useContext(TokenModalContext);
  const memoedValue = useRef(value);
  const memoedOptions = useRef(options);

  useEffect(() => {
    memoedValue.current.setOptions({
      ...getDefaultOptions(),
      ...memoedOptions.current,
    });
  }, [memoedValue, memoedOptions]);

  return value;
};

export const getDefaultOptions = (): TokenModalOptions => ({
  isClosable: true,
  onSelectTokenCallback: () => undefined,
  returnPath: "",
  assets: [],
});

interface Props {
  isClosable: boolean;
  isOpen: boolean;
  onClose: VoidNoArgs;
  onSelectToken?: () => void;
  returnPath?: string;
  serviceName: string;
  assets: Asset[];
}

const TokenModalComponent: React.FC<Props> = ({
  isClosable,
  isOpen,
  onClose,
  onSelectToken,
  returnPath,
  serviceName,
  assets,
}) => {
  const { mode } = useColorMode();

  const handleClose = () => isClosable && onClose();

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
            {isClosable ? (
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
              {assets.map((item, key) => (
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
                          <TokenIcon width={40} height={40} name={item.name} />
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
                            color={mode("secondary.100", "secondary.100.dark")}
                          >
                            {item.label}
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

const TokenModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setOptions] = useState<TokenModalOptions>(getDefaultOptions);
  const [serviceName, setServiceName] = useState<ServiceName | "">("");
  const handleOpen: OpenTokenDialogFn = (assets, sn: ServiceName) => {
    setServiceName(sn);
    setOptions((prev) => ({ ...prev, assets }));
    onOpen();
  };

  const handleSelectToken = () => {
    options.onSelectTokenCallback();
    handleClose();
  };

  const handleClose = () => {
    setOptions(getDefaultOptions());
    onClose();
  };

  return (
    <TokenModalContext.Provider
      value={{
        closeDialog: handleClose,
        onSelectToken: handleSelectToken,
        openDialog: handleOpen,
        setOptions,
        assets: options.assets,
      }}
    >
      <TokenModalComponent
        isOpen={isOpen}
        isClosable={options.isClosable}
        serviceName={serviceName}
        onClose={handleClose}
        onSelectToken={handleSelectToken}
        returnPath={options.returnPath}
        assets={options.assets}
      />

      {children}
    </TokenModalContext.Provider>
  );
};

export default TokenModalProvider;
