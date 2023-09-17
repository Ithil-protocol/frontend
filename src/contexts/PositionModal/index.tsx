/* eslint-disable react-hooks/exhaustive-deps */
import {
  Modal as ChakraModal,
  Grid,
  GridItem,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SliderProps,
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
  isClosable: IsClosable;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  lockTimeText?: string;
  onPurchasePriceChange?: SliderProps["onChange"];
  onSlippageChange?: SliderProps["onChange"];
  onSubmit: VoidNoArgs;
  percentage?: number;
  slippage?: number;
  submitText: string;
  title: string;
}

// interface OpenFnDefaultOptions extends Partial<ModalOptions> {}

type OpenFn = (d: Data, o?: Partial<ModalOptions>) => void;

const PositionModalComponent: React.FC<{
  data: Data;
  isClosable: boolean;
  isOpen: boolean;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  lockTimeText: string;
  onClose: CloseDialogFn;
  onPurchasePriceChange?: SliderProps["onChange"];
  onSlippageChange?: SliderProps["onChange"];
  onSubmit: VoidNoArgs;
  percentage?: number;
  slippage?: number;
  submitText: string;
  title: string;
}> = ({
  data,
  isClosable,
  isOpen,
  isSubmitDisabled,
  isSubmitLoading,
  lockTimeText,
  onClose,
  onPurchasePriceChange,
  onSlippageChange,
  onSubmit,
  percentage,
  slippage,
  submitText,
  title,
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
          {title}
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
              <PositionsDetails
                data={data}
                lockTimeText={lockTimeText}
                onPurchasePriceChange={onPurchasePriceChange}
                onSlippageChange={onSlippageChange}
                percentage={percentage}
                slippage={slippage}
              />

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
    title: "",
  });

  const [modalOptions, setModalOptions] = useState(getModalDefaultOptions);

  const getDefaultData = (): Data => ({
    position: "aave",
    token: "",
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

  const handleSubmit = () => {
    modalOptions.onSubmit();
    onClose();
  };

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
        title={modalOptions.title}
        onPurchasePriceChange={modalOptions.onPurchasePriceChange}
        onSlippageChange={modalOptions.onSlippageChange}
        percentage={modalOptions.percentage}
        slippage={modalOptions.slippage}
        isClosable={modalOptions.isClosable}
        isOpen={isOpen}
        onClose={onClose}
        submitText={modalOptions.submitText}
        lockTimeText={modalOptions.lockTimeText || ""}
        isSubmitLoading={
          modalOptions.submitText === "" ? true : modalOptions.isSubmitLoading
        }
        isSubmitDisabled={
          modalOptions.submitText === "" ? true : modalOptions.isSubmitDisabled
        }
        onSubmit={handleSubmit}
      />
      {children}
    </PositionModalContext.Provider>
  );
};

export const usePositionModal = (options: ModalOptions) => {
  const { setOptions, ...rest } = useContext(PositionModalContext);

  const onSubmit = useCallback(() => {
    options.onSubmit();
  }, [options.onSubmit]);
  const onPurchasePriceChange = useCallback(
    (value: number) => {
      options.onPurchasePriceChange?.(value);
    },
    [options.onSubmit]
  );
  const onSlippageChange = useCallback(
    (value: number) => {
      options.onSlippageChange?.(value);
    },
    [options.onSubmit]
  );

  useEffect(() => {
    setOptions({
      ...options,
      onPurchasePriceChange,
      onSlippageChange,
      onSubmit,
    });
  }, [
    options.submitText,
    options.isSubmitDisabled,
    options.percentage,
    options.slippage,
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
