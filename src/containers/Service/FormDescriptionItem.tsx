import { SkeletonText, Text } from "@chakra-ui/react";

import { useColorMode } from "@/hooks/useColorMode";

interface Props {
  leftPart: string;
  rightPart?: string | number;
  extension: string;
  isLoading?: boolean;
}

const FormDescriptionItem: React.FC<Props> = ({
  extension,
  leftPart,
  rightPart,
  isLoading = false,
}) => {
  const { mode } = useColorMode();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 5px 5px 15px",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "24px",
          }}
          color={mode("primary.200.dark", "primary.700.dark")}
        >
          {leftPart}
        </Text>
        {isLoading ? (
          <SkeletonText noOfLines={1} width={50} />
        ) : (
          <Text
            style={{
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            <span>{rightPart}</span>
            <span>{extension}</span>
          </Text>
        )}
      </div>
    </>
  );
};

export default FormDescriptionItem;
