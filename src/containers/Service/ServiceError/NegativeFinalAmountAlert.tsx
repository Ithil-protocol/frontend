import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

const NegativeFinalAmountAlert = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      {/* <AlertTitle>Error!</AlertTitle> */}
      <AlertDescription>Insufficient token allocation.</AlertDescription>
    </Alert>
  );
};

export default NegativeFinalAmountAlert;
