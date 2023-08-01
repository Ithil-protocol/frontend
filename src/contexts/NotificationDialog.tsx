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
import { CloseDialogFn } from "@/types";

type DialogStatus = "error" | "warning" | "success" | "info" | "loading";
type Duration = number;
type Title = string;
type Description = string;
type IsClosable = boolean;

interface OpenFnBaseOptions {
  duration: Duration;
  isClosable: IsClosable;
}
interface DialogOptions extends OpenFnBaseOptions {
  description: Description;
  duration: Duration;
  isClosable: IsClosable;
  status: DialogStatus;
  title: Title;
}

interface OpenFnDefaultOptions extends Partial<OpenFnBaseOptions> {
  description?: string;
  status?: DialogStatus;
  title?: Title;
}

type OpenFn = (o: OpenFnDefaultOptions) => void;

type CustomOpenFn = (
  description: Description | any,
  title?: Title,
  options?: OpenFnBaseOptions
) => void;

type CustomOpenFnCreator = (status: DialogStatus) => CustomOpenFn;

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
  const { isOpen, onClose, onOpen } = useDisclosure();

  const createCustomOpenFn: CustomOpenFnCreator =
    (status) =>
    (description, title = "", options = getDialogDefaultOptions()) => {
      openDialog({
        ...options,
        description: resolveDescription(description),
        status,
        title,
      });
    };

  const openError = createCustomOpenFn("error");
  const openLoading = createCustomOpenFn("loading");
  const openSuccess = createCustomOpenFn("success");

  const openDialog: OpenFn = (options) => {
    const newOptions = mergeOptions(options);

    setDialogOptions(newOptions);
    onOpen();

    if (newOptions.isClosable)
      setTimeout(() => {
        closeDialog();
      }, newOptions.duration);
  };

  const closeDialog: CloseDialogFn = () => {
    setDialogOptions(getDialogDefaultOptions());
    onClose();
  };

  const mergeOptions = (o: Partial<DialogOptions>) => ({
    ...getDialogDefaultOptions(),
    ...o,
  });

  const resolveDescription = (d: any) =>
    typeof d === "string" ? d : getDescriptionFromObject(d) || "";

  const getDescriptionFromObject = (o: {
    shortMessage?: string;
    message?: string;
  }) => o.shortMessage || o.message;

  return (
    <NotificationDialogContext.Provider
      value={{
        close: closeDialog,
        open: openDialog,
        openError,
        openLoading,
        openSuccess,
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

            <Text
              fontSize={24}
              fontWeight={"bold"}
              overflowWrap="anywhere"
              textAlign="center"
            >
              {title}
            </Text>

            <Text
              fontSize={17}
              fontWeight={"light"}
              overflowWrap="anywhere"
              textAlign="center"
            >
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
  close: CloseDialogFn;
  open: OpenFn;
  openError: CustomOpenFn;
  openLoading: CustomOpenFn;
  openSuccess: CustomOpenFn;
}>({
  close: () => undefined,
  open: () => undefined,
  openError: () => undefined,
  openLoading: () => undefined,
  openSuccess: () => undefined,
});

export default NotificationDialogProvider;
