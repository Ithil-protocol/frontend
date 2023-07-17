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
      <AlertDescription>Not enough liquidity in the vault.</AlertDescription>
    </Alert>
  );
};

export default FreeLiquidityError;
