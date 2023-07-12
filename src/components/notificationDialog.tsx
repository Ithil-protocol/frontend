import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";

import { Error as ErrorIcon } from "@/assets/svgs";
import { CloseDialogFn } from "@/types";

interface Props {
  isOpen: boolean;
  message: string;
  onClose: CloseDialogFn;
}

const NotificationDialog: React.FC<Props> = ({ isOpen, onClose, message }) => {
  const dialogRef = useRef<null | any>(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={dialogRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader display="flex" justifyContent="center">
            {/* <InformationIcon className="w-16 h-16 text-blue-500" /> */}
            {/* <WarningIcon className="w-16 h-16 text-orange-500" /> */}
            {/* <CheckIcon className="w-16 h-16 text-green-500" /> */}
            <ErrorIcon className="w-16 h-16 text-red-500" />
          </AlertDialogHeader>
          <AlertDialogBody display="flex" justifyContent="center" padding={13}>
            <Text fontSize={20}> {message}</Text>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default NotificationDialog;
