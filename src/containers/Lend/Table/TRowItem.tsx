import { Td } from "@chakra-ui/react";
import { FC } from "react";

import { DynamicEstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { Token } from "@/types/onchain.types";

interface Props {
  isVaultsLoading: boolean;
  isVaultsError: boolean;
  value: bigint | undefined;
  token: Token;
  width?: string;
}

const TRowItem: FC<Props> = ({
  isVaultsError,
  isVaultsLoading,
  value,
  token,
  width = "auto",
}) => {
  return (
    <Td width={width}>
      {isVaultsLoading || isVaultsError ? (
        <Loading />
      ) : (
        <DynamicEstimatedValue value={value} token={token} />
      )}
    </Td>
  );
};

export default TRowItem;
