/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useEffect, useState } from 'react';

import Txt from '@/components/based/Txt';
import Tooltip from '@/components/based/Tooltip';

interface IInputField {
  label?: string;
  onChange: (value: string) => void;
  value: string;
  renderRight?: React.ReactNode;
  placeholder?: string;
  className?: string | undefined;
  tooltipText?: string;
}

const InputField: FC<IInputField> = ({
  label,
  onChange,
  value,
  renderRight,
  placeholder,
  className,
  tooltipText,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div
      className={className}
      tw="flex flex-col justify-center gap-1 my-2 w-full"
    >
      <div tw="flex flex-row gap-2 items-center text-font-200">
        {label && <Txt.Body2Regular>{label}</Txt.Body2Regular>}
        {tooltipText && <Tooltip text={tooltipText} />}
      </div>
      <div
        css={[
          tw`flex flex-row items-center bg-primary-200 rounded-md tablet:height[48px] height[43px] px-3 gap-1`,
          inputIsFocused &&
            tw`outline-[#4E5F71 solid]! dark:outline-[#A4B1BE solid]!`,
        ]}
      >
        <input
          placeholder={placeholder}
          onFocus={() => setInputIsFocused(true)}
          onBlur={() => setInputIsFocused(false)}
          tw="flex-grow bg-primary-200 rounded-md text-input-text font-sans text-font font-normal max-w-none min-width[20px]"
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => {
            setInputValue(value);
            onChange(value);
          }}
        />
        {renderRight}
      </div>
    </div>
  );
};

export default InputField;
