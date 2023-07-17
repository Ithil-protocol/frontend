import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

const FreeLiquidityError: React.FC = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>Interest rate above maximum.</AlertDescription>
    </Alert>
  );
};

export default FreeLiquidityError;
