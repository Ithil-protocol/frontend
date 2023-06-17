import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

import { VoidNoArgs } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: VoidNoArgs;
  title: string;
  modalBody: JSX.Element;
  bg: string;
  modalFooter?: JSX.Element;
}
const Modal: React.FC<Props> = ({
  isOpen,
  modalBody,
  onClose,
  title,
  bg,
  modalFooter,
}) => {
  return (
    <>
      <ChakraModal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={bg}>
          <ModalHeader
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>
          <ModalFooter>{modalFooter}</ModalFooter>
        </ModalContent>
      </ChakraModal>
    </>
  );
};

export default Modal;
