/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useEffect, useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';

import Modal from 'src/components/based/Modal';
import Txt from 'src/components/based/Txt';
import InputField from 'src/components/based/InputField';
import { TokenDetails } from 'src/global/types';
import { TOKEN_LIST } from 'src/global/ithil';
import { useChainId } from 'src/hooks';

interface ITokenModal {
  open: boolean;
  availableTokens?: TokenDetails[];
  selectedToken?: TokenDetails;
  onClose: () => void;
  onSelect(token: TokenDetails): void;
}

const TokenModal: FC<ITokenModal> = ({
  open,
  availableTokens,
  selectedToken,
  onClose,
  onSelect,
}) => {
  const chainId = useChainId();
  const [search, setSearch] = useState('');
  const [filteredTokenList, setFilteredTokenList] = useState<TokenDetails[]>(
    availableTokens ?? TOKEN_LIST[chainId]
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
      TOKEN_LIST[chainId].filter(({ symbol }) =>
        symbol.trim().includes(val.toUpperCase())
      )
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
      <div tw="w-full height[384px] overflow-y-auto">
        {filteredTokenList.map((token) => {
          return (
            <div
              key={token.name}
              css={[
                tw`w-full flex flex-row justify-between cursor-pointer`,
                token === selectedToken && tw`opacity-50 cursor-default`,
              ]}
              onClick={() => token !== selectedToken && onSelect(token)}
            >
              <div tw="flex flex-row justify-start items-center p-0 my-2">
                {token.logoURI ? (
                  <img
                    tw="w-8 h-8 mr-4"
                    src={token.logoURI}
                    alt="token image"
                  />
                ) : (
                  <div tw="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center mr-4">
                    <Txt.Body2Bold>?</Txt.Body2Bold>
                  </div>
                )}
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
