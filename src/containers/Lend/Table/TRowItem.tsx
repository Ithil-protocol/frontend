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
}

const TRowItem: FC<Props> = ({
  isVaultsError,
  isVaultsLoading,
  value,
  token,
}) => {
  return (
    <Td>
      {isVaultsLoading || (isVaultsError && <Loading />)}
      <DynamicEstimatedValue value={value} token={token} />
    </Td>
  );
};

export default TRowItem;
