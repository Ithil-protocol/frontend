/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { ArrowDown } from 'phosphor-react';

import InputFieldMax from './InputFieldMax';

import { TokenDetails } from '@/global/types';
import Button from '@/components/based/Button';
import TokenModal from '@/components/composed/trade/TokenModal';

interface ITokenInputField {
  label: string;
  value: string;
  setValue: (value: string) => void;
  onInput?: () => void;
  placeholder?: string;
  onTokenChange: (token: TokenDetails) => void;
  token: TokenDetails;
  noMax?: boolean;
  availableTokens?: TokenDetails[];
  stateChanger: Dispatch<SetStateAction<string>>;
}

const TokenInputField: FC<ITokenInputField> = ({
  label,
  value,
  setValue,
  placeholder,
  onTokenChange,
  token,
  stateChanger,
  onInput,
  availableTokens,
  noMax = false,
}) => {
  const [tokenModalOpened, setTokenModalOpened] = useState(false);

  return (
    <>
      <InputFieldMax
        label={label}
        value={value}
        onChange={setValue}
        token={token}
        noMax={noMax}
        onInput={onInput}
        stateChanger={stateChanger}
        placeholder={placeholder ?? '0'}
        renderRight={
          <>
            <Button
              css={[
                tw`bg-primary-400 dark:bg-primary-300 h-6 tablet:h-7 desktop:h-8`,
              ]}
              text={token.symbol}
              leftIcon={() => (
                <img tw="w-4 h-4 mr-1" src={token.logoURI} alt="token image" />
              )}
              rightIcon={ArrowDown}
              onClick={() => setTokenModalOpened(true)}
            />
          </>
        }
      />
      <TokenModal
        availableTokens={availableTokens}
        open={tokenModalOpened}
        onClose={() => {
          setTokenModalOpened(false);
        }}
        onSelect={(token) => {
          onTokenChange(token);
          setTokenModalOpened(false);
        }}
      />
    </>
  );
};

export default TokenInputField;
