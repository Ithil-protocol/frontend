import {
  InputGroup,
  NumberInput,
  NumberInputField,
  UseCounterProps,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

import AdvancedFormLabel from "../AdvancedFormLabel";

interface Props {
  leverage: string;
  setLeverage: Dispatch<SetStateAction<string>>;
}

const LeverageInput: React.FC<Props> = ({ leverage, setLeverage }) => {
  const [value, setValue] = useState(`${Number(leverage) + 1}`);

  const onInputChange: UseCounterProps["onChange"] = (value) => {
    setValue(value);
    if (!isNaN(Number(value))) {
      setLeverage((+value - 1).toString());
    } else {
      setLeverage("0");
    }
  };

  return (
    <>
      <AdvancedFormLabel label="Leverage" tooltip="Leverage" />
      <InputGroup size="md">
        <NumberInput
          width="100%"
          value={value}
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
