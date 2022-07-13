/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useState } from 'react';
import { CaretDown } from 'phosphor-react';

import TokenModal from './TokenModal';

import Button from '@/components/based/Button';
import { TokenDetails } from '@/global/types';

interface ITokenField {
  onTokenChange(token: TokenDetails): void;
  token: TokenDetails;
}

const TokenField: FC<ITokenField> = ({ token, onTokenChange }) => {
  const [tokenModalOpened, setTokenModalOpened] = useState(false);

  return (
    <>
      <Button
        css={[
          tw`bg-primary-400 dark:bg-primary-300 h-9 tablet:h-10 desktop:h-11 px-2`,
        ]}
        text={token.symbol}
        leftIcon={() => (
          <img tw="w-4 h-4 mr-1" src={token.logoURI} alt="token image" />
        )}
        rightIcon={CaretDown}
        onClick={() => setTokenModalOpened(true)}
      />
      <TokenModal
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

export default TokenField;
