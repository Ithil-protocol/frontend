import {
  Button,
  Modal as ChakraModal,
  CloseButton,
  Divider,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";

import Slider from "@/components/Slider";
import TokenIcon from "@/components/TokenIcon";
import { useColorMode } from "@/hooks/useColorMode";
import { VoidNoArgs } from "@/types";

import ModalItem from "./ModalItem";

interface Data {
  pnl?: string;
  margin?: string;
  amount?: string;
  service: string | undefined;
  token: string;
}

interface Props {
  slider: number;
  data: Data;
  isOpen: boolean;
  onOpen: VoidNoArgs;
  onClose: VoidNoArgs;
}

const Modal: FC<Props> = ({ slider, data, isOpen, onClose, onOpen }) => {
  const { mode } = useColorMode();
  const handelConfirmBtn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    // console.log("data.quote", data.quote);
    // if (data.isPnlLoading) return;
    // const initialQuote = data?.quote || 0n;
    // const qoutes: Record<string, bigint> = {
    //   AAVE: (initialQuote * 999n) / 1000n,
    //   GMX: (initialQuote * 9n) / 10n,
    // };
    // const quote = qoutes[data?.type] || 0n;
    // const result = await close({
    //   args: [
    //     data.id,
    //     encodeAbiParameters(parseAbiParameters("uint256"), [quote]),
    //   ],
    // });
    // await trackTransaction(result, "Position closed");
    // queryClient.resetQueries();
  };
  return (
    <ChakraModal onClose={onClose} isCentered isOpen={isOpen}>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        display="flex"
        flexDirection="column"
        gap="10px"
        bg={mode("primary.100", "primary.100.dark")}
      >
        <ModalHeader
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Close position</span>
          <Text
            style={{
              cursor: "pointer",
              borderRadius: "8px",
              padding: "1px",
            }}
            onClick={() => onClose()}
          >
            <CloseButton width={7} height={7} />
          </Text>
        </ModalHeader>

        <Divider
          style={{
            width: "95%",
            alignSelf: "center",
          }}
        />

        <ModalBody marginBottom={8}>
          <VStack spacing="25px" marginTop={4} alignItems="start">
            <HStack alignItems="center">
              <ModalItem title="Service" value={data.service} />{" "}
              <TokenIcon name={data.token} width={20} height={20} />
            </HStack>
            <ModalItem title="Pnl" value={data.pnl} />
            <ModalItem title="Amount" value={data.amount} />
            <ModalItem title="Margin" value={data.margin} />

            {slider && <Slider value={slider} onChange={undefined} />}
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <HStack>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              color="#f35959"
              onClick={handelConfirmBtn}
            >
              Confirm
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
