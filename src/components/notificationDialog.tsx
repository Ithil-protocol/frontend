import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";

import {
  Check as CheckIcon,
  CloseButton,
  Error as ErrorIcon,
  Information as InformationIcon,
  Warning as WarningIcon,
} from "@/assets/svgs";
import { CloseDialogFn, DialogStatus } from "@/types";

interface Props {
  isOpen: boolean;
  message: string;
  onClose: CloseDialogFn;
  status: DialogStatus;
}

const icons: {
  [key in DialogStatus]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  error: ErrorIcon,
  info: InformationIcon,
  success: CheckIcon,
  warning: WarningIcon,
};

const iconClassNames: {
  [key in DialogStatus]: string;
} = {
  error: "text-red-500",
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
};

const NotificationDialog: React.FC<Props> = ({
  isOpen,
  message,
  onClose,
  status,
}) => {
  const dialogRef = useRef<null | any>(null);

  const Icon = icons[status];
  const classNames = iconClassNames[status];

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={dialogRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay backdropFilter="blur(10px)">
        <AlertDialogContent>
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
              onClick={onClose}
            >
              <CloseButton width={14} height={14} />
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            padding={13}
          >
            <Icon className={`w-16 h-16 ${classNames}`} />

            <Text fontSize={20}> {message}</Text>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default NotificationDialog;
