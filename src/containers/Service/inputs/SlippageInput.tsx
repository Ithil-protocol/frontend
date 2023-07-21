import {
  InputGroup,
  NumberInput,
  NumberInputField,
  UseCounterProps,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

import AdvancedFormLabel from "../AdvancedFormLabel";

interface Props {
  slippage: string;
  setSlippage: Dispatch<SetStateAction<string>>;
}

const SlippageInput: React.FC<Props> = ({ slippage, setSlippage }) => {
  const [value, setValue] = useState(`${Number(slippage) * 100}`);

  const onInputChange: UseCounterProps["onChange"] = (value) => {
    setValue(value);
    setSlippage((+value / 100).toString());
  };

  return (
    <>
      <AdvancedFormLabel label="Slippage" tooltip="Not implemented" />
      <InputGroup size="md">
        <NumberInput
          width="100%"
          step={0.1}
          value={value}
          onChange={onInputChange}
          precision={1}
          min={0.1}
          defaultValue={0.1}
          variant="filled"
        >
          <NumberInputField />
        </NumberInput>
      </InputGroup>
    </>
  );
};

export default SlippageInput;
