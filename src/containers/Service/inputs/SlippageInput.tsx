import { InputGroup, NumberInput, NumberInputField } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import AdvancedFormLabel from "../AdvancedFormLabel";

interface Props {
  slippage: string;
  setSlippage: Dispatch<SetStateAction<string>>;
}

const SlippageInput: React.FC<Props> = ({ slippage, setSlippage }) => {
  const [value, setValue] = useState(`${Number(slippage) * 100}`);
  const [once, setOnce] = useState(false);
  useEffect(() => {
    if (!once) {
      setOnce(true);
      return;
    }
    if (!isNaN(Number(value))) {
      setSlippage(`${Number(value) / 100}`);
    }
  }, [value]);
  return (
    <>
      <AdvancedFormLabel label="Slippage" tooltip="Not implemented" />
      <InputGroup size="md">
        <NumberInput
          width="100%"
          step={0.1}
          value={value}
          onChange={setValue}
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
