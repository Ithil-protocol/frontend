import { HStack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface ModalItemProps {
  title: string;
  value?: string | number;
}

const ModalItem: FC<ModalItemProps> = ({ title, value }) => {
  return (
    <>
      {value && (
        <HStack>
          <Text>{title} :</Text>
          <Text>{value}</Text>
        </HStack>
      )}
    </>
  );
};

export default ModalItem;
