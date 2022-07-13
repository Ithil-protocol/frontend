/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  FC,
} from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';

import Txt from '@/components/based/Txt';

interface IInputFieldMax {
  label?: string;
  onChange: (value: string) => void;
  renderRight?: React.ReactNode;
  value: string;
  unit: string;
  address: string;
  placeholder?: string;
  className?: string | undefined;
  onMaxClick?: () => void;
  stateChanger: Dispatch<SetStateAction<string>>;
}

const InputFieldMax: FC<IInputFieldMax> = ({
  label,
  onChange,
  value,
  unit,
  address,
  placeholder,
  className,
  stateChanger,
}) => {
  const { account } = useEthers();
  const [inputValue, setInputValue] = useState(value);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const tokenBalance = useTokenBalance(address, account);

  const getMax = () => {
    if (!tokenBalance) return;
    stateChanger(tokenBalance.toString());
    setInputValue(tokenBalance.toString());
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div
      className={className}
      tw="flex flex-col justify-center gap-1 my-2 w-full"
    >
      {label && <Txt.Body2Regular>{label}</Txt.Body2Regular>}
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
          tw="flex-grow bg-primary-200 rounded-md text-input-text font-sans text-font font-normal focus:outline-none max-w-none min-width[20px]"
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => {
            setInputValue(value);
            onChange(value);
          }}
        />
        <button
          onClick={() => getMax()}
          css={[
            tw`border-primary-400 dark:border-primary-300 rounded-md border-2 h-8 px-2`,
          ]}
        >
          <Txt.Body2Regular>Max</Txt.Body2Regular>
        </button>
        <Txt.InputText tw="text-font-100">{unit}</Txt.InputText>
      </div>
    </div>
  );
};

export default InputFieldMax;
