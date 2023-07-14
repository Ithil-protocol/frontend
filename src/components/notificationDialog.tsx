import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  CircularProgress,
  CircularProgressProps,
  Text,
} from "@chakra-ui/react";
import React, { useRef } from "react";

import {
  Check as CheckIcon,
  CloseButton,
  Error as ErrorIcon,
  Information as InformationIcon,
  Warning as WarningIcon,
} from "@/assets/svgs";
import { palette } from "@/styles/theme/palette";
import { CloseDialogFn, DialogStatus } from "@/types";

interface Props {
  description: string;
  isClosable: boolean;
  isOpen: boolean;
  onClose: CloseDialogFn;
  status: DialogStatus;
  title: string;
}

const icons: {
  [key in DialogStatus]:
    | React.FC<React.SVGProps<SVGSVGElement>>
    | React.FC<CircularProgressProps>;
} = {
  error: ErrorIcon,
  info: InformationIcon,
  loading: CircularProgress,
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

const NotificationDialog: React.FC<Props> = ({
  description,
  isClosable,
  isOpen,
  onClose,
  status,
  title,
}) => {
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
            }}
          >
            <span></span>
            <span></span>

            <Text
              style={{
                cursor: "pointer",
                borderRadius: "8px",
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
              Something went wrong
            </Text>

            <div
              style={{
                borderBottom: "1px solid gray",
                width: "100%",
              }}
            ></div>

            <Button
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
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default NotificationDialog;
