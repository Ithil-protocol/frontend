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
} from "@chakra-ui/react";

import { CloseButton } from "@/assets/svgs";
import PrivateButton from "@/components/PrivateButton";
import { CloseDialogFn, PositionData, VoidNoArgs } from "@/types";

import PositionsDetails from "./PositionsDetails";

interface Props {
  canShowPercentageSlider?: boolean;
  canShowSlippageSlider?: boolean;
  data: PositionData;
  isOpen: boolean;
  onClose: CloseDialogFn;
  onPurchasePriceChange?: SliderProps["onChange"];
  onSlippageChange?: SliderProps["onChange"];
  onSubmit: VoidNoArgs;
  submitText: string;
  title: string;
}

export const PositionModal: React.FC<Props> = ({
  canShowPercentageSlider,
  data,
  isOpen,
  onClose,
  onPurchasePriceChange,
  onSlippageChange,
  onSubmit,
  submitText,
  title,
  canShowSlippageSlider,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <ChakraModal onClose={onClose} isCentered isOpen={isOpen}>
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

          <Text
            style={{
              cursor: "pointer",
              borderRadius: "8px",
              padding: "8px",
            }}
            onClick={onClose}
          >
            <CloseButton width={14} height={14} />
          </Text>
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
                canShowPercentageSlider={canShowPercentageSlider}
                canShowSlippageSlider={canShowSlippageSlider}
                onPurchasePriceChange={onPurchasePriceChange}
                onSlippageChange={onSlippageChange}
              />

              <PrivateButton
                style={{
                  border: "none",
                }}
                onClick={handleSubmit}
                loadingText="Waiting"
                mt="20px"
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
