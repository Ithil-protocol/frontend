import {
  Modal as ChakraModal,
  Grid,
  GridItem,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { CloseButton } from "@/assets/svgs";
import PrivateButton from "@/components/PrivateButton";
import { CloseDialogFn, VoidNoArgs } from "@/types";

import PositionsDetails from "./PositionsDetails";
import { Data } from "./types";

type IsClosable = boolean;

interface ModalOptions {
  submitText: string;
  isSubmitLoading: boolean;
  isClosable: IsClosable;
  isSubmitDisabled: boolean;
  onSubmit: VoidNoArgs;
}

// interface OpenFnDefaultOptions extends Partial<ModalOptions> {}

type OpenFn = (d: Data, o?: Partial<ModalOptions>) => void;

const PositionModalComponent: React.FC<{
  isClosable: boolean;
  isOpen: boolean;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  onClose: CloseDialogFn;
  onSubmit: VoidNoArgs;
  data: Data;
  submitText: string;
}> = ({
  isClosable,
  isOpen,
  isSubmitDisabled,
  isSubmitLoading,
  onClose,
  onSubmit,
  data,
  submitText,
}) => {
  const handleClose = () => isClosable && onClose();

  return (
    <ChakraModal onClose={handleClose} isCentered isOpen={isOpen}>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Open Position
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

        <ModalBody
          style={{
            paddingBottom: "20px",
          }}
        >
          <GridItem area="nav">
            <Grid
              gap={{
                base: "12px",
                md: "20px",
                lg: "24px",
              }}
              height="full"
              width="full"
              maxWidth="500px"
            >
              <PositionsDetails data={data} />

              <PrivateButton
                style={{
                  border: "none",
                }}
                onClick={onSubmit}
                isDisabled={isSubmitDisabled}
                loadingText="Waiting"
                mt="20px"
                isLoading={isSubmitLoading}
              >
                {submitText}
              </PrivateButton>
            </Grid>
          </GridItem>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

const PositionModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const getModalDefaultOptions = (): ModalOptions => ({
    isClosable: true,
    isSubmitDisabled: false,
    isSubmitLoading: false,
    onSubmit: () => undefined,
    submitText: "",
  });

  const [modalOptions, setModalOptions] = useState(getModalDefaultOptions);

  const getDefaultData = (): Data => ({
    amount: "0",
    leverage: "0",
    position: "aave",
    slippage: "0",
    token: "",
    collateral: "0",
  });

  const [data, setData] = useState<Data>(getDefaultData);

  const handleOpen: OpenFn = (d = getDefaultData(), o = {}) => {
    onOpen();
    setData({
      ...getDefaultData(),
      ...d,
    });
    setModalOptions(mergeOptions(o));
  };

  const mergeOptions = (o: Partial<ModalOptions>) => ({
    ...getModalDefaultOptions(),
    ...modalOptions,
    ...o,
  });

  return (
    <PositionModalContext.Provider
      value={{
        close: onClose,
        open: handleOpen,
        setOptions: (o: ModalOptions) =>
          setModalOptions({ ...mergeOptions, ...o }),
      }}
    >
      <PositionModalComponent
        data={data}
        isClosable={modalOptions.isClosable}
        isOpen={isOpen}
        onClose={onClose}
        submitText={modalOptions.submitText}
        isSubmitLoading={
          modalOptions.submitText === "" ? true : modalOptions.isSubmitLoading
        }
        isSubmitDisabled={
          modalOptions.submitText === "" ? true : modalOptions.isSubmitDisabled
        }
        onSubmit={modalOptions.onSubmit}
      />
      {children}
    </PositionModalContext.Provider>
  );
};

export const useOpenPositionModal = (options: ModalOptions) => {
  const { setOptions, ...rest } = useContext(PositionModalContext);

  const onSubmit = useCallback(() => {
    options.onSubmit();
  }, [options.onSubmit]);

  useEffect(() => {
    setOptions({ ...options, onSubmit });
  }, [
    options.submitText,
    options.isSubmitDisabled,
    options.isSubmitLoading,
    options.isClosable,
  ]);

  return {
    ...rest,
  };
};

const PositionModalContext = createContext<{
  close: CloseDialogFn;
  open: OpenFn;
  setOptions: (o: ModalOptions) => void;
}>({
  close: () => undefined,
  open: () => undefined,
  setOptions: () => undefined,
});

export default PositionModalProvider;
