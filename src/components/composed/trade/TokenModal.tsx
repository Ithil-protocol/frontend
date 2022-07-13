/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useEffect, useState } from 'react';
import TokenList from '@ithil-protocol/deployed/latest/tokenlist.json';
import { MagnifyingGlass } from 'phosphor-react';

import Modal from '@/components/based/Modal';
import Txt from '@/components/based/Txt';
import InputField from '@/components/based/InputField';
import { TokenDetails } from '@/global/types';

interface ITokenModal {
  open: boolean;
  availableTokens?: TokenDetails[];
  onClose: () => void;
  onSelect(token: TokenDetails): void;
}

const TokenModal: FC<ITokenModal> = ({
  open,
  availableTokens,
  onClose,
  onSelect,
}) => {
  const { tokens } = TokenList;
  const [search, setSearch] = useState('');
  const [filteredTokenList, setFilteredTokenList] = useState<TokenDetails[]>(
    availableTokens ?? tokens
  );

  useEffect(() => {
    if (availableTokens) {
      setSearch('');
      setFilteredTokenList(availableTokens);
    }
  }, [availableTokens]);

  const searchOnChange = (value: string) => {
    setSearch(value);

    const val = value.trim().toLowerCase();
    setFilteredTokenList(
      tokens
        .filter(({ name }) => name.trim().toLowerCase().startsWith(val))
        .slice(0, 6)
    );
  };

  return (
    <Modal tw="bg-secondary width[600px]" open={open} onClose={onClose}>
      <div tw="flex flex-row justify-center items-center w-full">
        <Txt.Heading2 tw="self-end">Select a token</Txt.Heading2>
      </div>
      <InputField
        value={search}
        onChange={(value) => searchOnChange(value)}
        renderRight={<MagnifyingGlass tw="text-secondary" />}
      />
      <div tw="w-full height[1px] bg-primary-300 my-4"></div>
      <div tw="w-full height[384px]">
        {filteredTokenList.map((token) => {
          return (
            <div
              key={token.name}
              tw="w-full flex flex-row justify-between cursor-pointer"
              onClick={() => onSelect(token)}
            >
              <div tw="flex flex-row justify-start items-center p-0 my-2">
                <img tw="w-8 h-8 mr-4" src={token.logoURI} alt="token image" />
                <div tw="flex flex-col justify-start">
                  <Txt.Body2Regular>{token.symbol}</Txt.Body2Regular>
                  <Txt.CaptionMedium>{token.name}</Txt.CaptionMedium>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default TokenModal;
