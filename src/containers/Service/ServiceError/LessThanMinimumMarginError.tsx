import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

const LessThanMinimumMarginError: React.FC = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      {/* <AlertTitle>Error!</AlertTitle> */}
      <AlertDescription>Margin is too low. Try higher margin.</AlertDescription>
    </Alert>
  );
};

export default LessThanMinimumMarginError;
