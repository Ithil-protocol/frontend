import {
  InputGroup,
  NumberInput,
  NumberInputField,
  UseCounterProps,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

import { isValidNumber } from "@/utils";

import AdvancedFormLabel from "../AdvancedFormLabel";

interface Props {
  leverage: string;
  setLeverage: Dispatch<SetStateAction<string>>;
}

const LeverageInput: React.FC<Props> = ({ leverage, setLeverage }) => {
  // const [value, setValue] = useState(`${Number(leverage) + 1}`);

  const onInputChange: UseCounterProps["onChange"] = (valueStr) => {
    const isValid = isValidNumber(valueStr);
    if (isValid) setLeverage(valueStr);
  };

  return (
    <>
      <AdvancedFormLabel label="Leverage" tooltip="Leverage" />
      <InputGroup size="md">
        <NumberInput
          width="100%"
          value={leverage}
          onChange={onInputChange}
          step={0.01}
          precision={2}
          min={1.01}
          variant="filled"
        >
          <NumberInputField />
        </NumberInput>
      </InputGroup>
    </>
  );
};

export default LeverageInput;
