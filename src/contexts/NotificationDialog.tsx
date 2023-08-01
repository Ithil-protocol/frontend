/* eslint-disable @typescript-eslint/no-empty-function */
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  CircularProgressProps,
  CloseButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

import {
  Check as CheckIcon,
  Error as ErrorIcon,
  Information as InformationIcon,
  Warning as WarningIcon,
} from "@/assets/svgs";
import NotificationDialogLoading from "@/components/notificationDialogLoading";
import { palette } from "@/styles/theme/palette";
import {
  CloseDialogFn,
  DialogOptions,
  DialogStatus,
  OpenDialogFnOptions,
  OpenNotificationDialogFn,
} from "@/types";

const icons: {
  [key in DialogStatus]:
    | React.FC<React.SVGProps<SVGSVGElement>>
    | React.FC<CircularProgressProps>;
} = {
  error: ErrorIcon,
  info: InformationIcon,
  loading: NotificationDialogLoading,
  success: CheckIcon,
  warning: WarningIcon,
};

const iconClassNames: {
  [key in DialogStatus]: string;
} = {
  error: "text-red-500",
  info: "text-blue-500",
  loading: "",
  success: "text-green-500",
  warning: "text-yellow-500",
};

const getDialogDefaultOptions = (): DialogOptions => ({
  description: "",
  duration: 0,
  isClosable: false,
  status: "error",
  title: "",
});

const NotificationDialogProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>(
    getDialogDefaultOptions
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDialog: OpenNotificationDialogFn = (options) => {
    const newOptions = {
      ...getDialogDefaultOptions(),
      ...options,
    };

    setDialogOptions(newOptions);
    onOpen();

    if (newOptions.isClosable && newOptions.duration)
      setTimeout(() => {
        closeDialog();
      }, newOptions.duration);
  };

  const closeDialog: CloseDialogFn = () => {
    setDialogOptions(getDialogDefaultOptions());
    onClose();
  };

  return (
    <NotificationDialogContext.Provider
      value={{
        open: openDialog,
        close: closeDialog,
      }}
    >
      <NotificationDialogComponent
        isOpen={isOpen}
        {...dialogOptions}
        onClose={closeDialog}
      />
      {children}
    </NotificationDialogContext.Provider>
  );
};

const NotificationDialogComponent: React.FC<{
  description: string;
  isClosable: boolean;
  isOpen: boolean;
  onClose: CloseDialogFn;
  status: DialogStatus;
  title: string;
}> = ({ description, isClosable, isOpen, onClose, status, title }) => {
  const dialogRef = useRef<null | any>(null);

  const Icon = icons[status];
  const classNames = iconClassNames[status];

  const handleClose = () => {
    if (isClosable) onClose();
  };

  const bgColors: { [key in typeof status]: string } = {
    error: palette.variants.primary.error,
    info: palette.variants.primary.action,
    success: palette.variants.primary.success,
    warning: palette.variants.primary.warning,
    loading: palette.variants.primary.action,
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={dialogRef}
      onClose={handleClose}
      isCentered
    >
      <AlertDialogOverlay backdropFilter="blur(10px)">
        <AlertDialogContent
          style={{
            borderRadius: " 20px",
          }}
        >
          <AlertDialogHeader
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <span></span>
            <span></span>

            <Text
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                padding: "5px",
              }}
              onClick={handleClose}
            >
              {isClosable ? (
                <CloseButton width={12} height={12} />
              ) : (
                <span></span>
              )}
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            gap={"20px"}
            padding={13}
          >
            <Icon
              value={80}
              isIndeterminate
              className={`w-16 h-16 ${classNames}`}
            />

            <Text fontSize={24} textAlign="center" fontWeight={"bold"}>
              {title}
            </Text>

            <Text fontWeight={"light"} textAlign="center" fontSize={17}>
              {description}
            </Text>

            {status !== "loading" && (
              <>
                <div
                  style={{
                    borderBottom: "1px solid gray",
                    width: "100%",
                  }}
                ></div>

                <Button
                  onClick={onClose}
                  style={{
                    width: "60%",
                    borderRadius: "20px",
                    backgroundColor: bgColors[status],
                  }}
                  _focusVisible={{
                    border: "transparent",
                  }}
                >
                  OK
                </Button>
              </>
            )}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export const useNotificationDialog = () => {
  return useContext(NotificationDialogContext);
};

const NotificationDialogContext = createContext<{
  open: OpenNotificationDialogFn;
  close: CloseDialogFn;
}>({
  close: () => {},
  open: (_o: OpenDialogFnOptions) => {},
});

export default NotificationDialogProvider;
