import { InputGroup, NumberInput, NumberInputField } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import AdvancedFormLabel from "../AdvancedFormLabel";

interface Props {
  leverage: string;
  setLeverage: Dispatch<SetStateAction<string>>;
}

const LeverageInput: React.FC<Props> = ({ leverage, setLeverage }) => {
  const [value, setValue] = useState(`${Number(leverage) + 1}`);
  const [once, setOnce] = useState(false);
  useEffect(() => {
    if (!once) {
      setOnce(true);
      return;
    }
    setLeverage(`${Number(value) - 1}`);
  }, [value]);
  return (
    <>
      <AdvancedFormLabel label="Leverage" tooltip="Leverage" />
      <InputGroup size="md">
        <NumberInput
          width="100%"
          value={value}
          onChange={setValue}
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
