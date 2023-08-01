import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

import PrivateButton from "@/components/PrivateButton";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { getDecimalRegex } from "@/data/regex";
import { LendingToken } from "@/types/onchain.types";
import { abbreviateBigNumber } from "@/utils/input.utils";

import TabSwitch from "./TabSwitch";

interface WidgetComponentProps {
  title: string;
  balance: bigint | undefined;

  token: LendingToken;

  inputAmount: string;
  onInputChange: (value: string) => void;
  onMaxClick: () => void;
  onPercentageClick: (value: number) => void;
  onActionClick: () => Promise<void>;

  isBalanceLoading: boolean;
  isButtonDisabled: boolean;
  isButtonLoading: boolean;
  isApproved: boolean;
  isMaxDisabled: boolean;
}
const WidgetComponent: React.FC<WidgetComponentProps> = ({
  balance,
  inputAmount,
  isBalanceLoading,
  isButtonDisabled,
  isButtonLoading,
  isMaxDisabled,
  onActionClick,
  onInputChange,
  onMaxClick,
  onPercentageClick,
  title,
  token: asset,
  isApproved,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 p-3 border md:p-4 lg:p-6 rounded-xl border-primary-300 bg-primary-contrast">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">{title}</Text>
        <div className="flex flex-row items-end justify-end gap-2">
          {isBalanceLoading ? (
            <Loading />
          ) : (
            <>
              <Text textStyle="lg">
                {abbreviateBigNumber(balance, asset.decimals)}
              </Text>
              <Text textStyle="lg">
                (<EstimatedValue value={balance} token={asset} />)
              </Text>
            </>
          )}
        </div>
      </div>

      <InputGroup size="md">
        <Input
          type="number"
          step="0.1"
          variant="filled"
          value={inputAmount}
          onChange={(event) => {
            const { value } = event.target;
            if (getDecimalRegex(asset.decimals).test(value) || value === "")
              onInputChange(value);
          }}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={onMaxClick}
            isDisabled={isMaxDisabled}
            variant="insideInput"
          >
            Max
          </Button>
        </InputRightElement>
      </InputGroup>

      <TabSwitch
        onChange={(value: string) => {
          const percent = Number(value);
          onPercentageClick(percent);
        }}
        values={[...Array(4)].map((_, idx) => ({
          title: `${(idx + 1) * 25}%`,
          value: `${(idx + 1) * 25}`,
        }))}
      />

      <PrivateButton
        onClick={onActionClick}
        isDisabled={isButtonDisabled}
        isLoading={isButtonLoading}
        loadingText="Awaiting"
        mt="20px"
      >
        {isApproved ? `${title} ${asset.name}` : `Approve ${asset.name}`}
      </PrivateButton>
    </div>
  );
};

export default WidgetComponent;
