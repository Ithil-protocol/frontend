/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, MouseEventHandler } from 'react';

import Txt from 'src/components/based/Txt';
import Tooltip from 'src/components/based/Tooltip';
import { ReactComponent as RadioButtonNotSelected } from 'src/assets/images/radioButton/notSelected.svg';
import { ReactComponent as RadioButtonSelected } from 'src/assets/images/radioButton/selected.svg';

interface RadioItem {
  label: string;
  value: string;
}

interface IRadioButton {
  selected: boolean;
  value: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const RadioButton: FC<IRadioButton> = ({ selected, value, onClick }) => {
  return (
    <button tw="flex flex-row items-center gap-2" onClick={onClick}>
      {selected ? <RadioButtonSelected /> : <RadioButtonNotSelected />}
      <Txt.Body2Regular css={[!selected && tw`text-font-100`]}>
        {value}
      </Txt.Body2Regular>
    </button>
  );
};

interface IRadioGroup {
  label?: string;
  items: RadioItem[];
  activeRadio: string;
  onChange: (value: string) => void;
  tooltipText?: string;
}

const RadioGroup: FC<IRadioGroup> = ({
  label,
  items,
  activeRadio,
  onChange,
  tooltipText,
}) => {
  return (
    <div tw="w-full flex flex-col gap-3">
      <div tw="flex items-center gap-2">
        <Txt.Body2Regular>{label}</Txt.Body2Regular>
        {tooltipText && <Tooltip text={tooltipText} />}
      </div>
      <div tw="flex flex-row gap-10">
        {items.map((radio) => (
          <RadioButton
            key={`${radio.value}`}
            selected={activeRadio === radio.value}
            value={radio.label}
            onClick={() => onChange(radio.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
