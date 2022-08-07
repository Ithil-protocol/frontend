/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useState } from 'react';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';
import { ClipLoader } from 'react-spinners';
import { v4 as uuid } from 'uuid';

import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import DataTable from '@/components/based/table/DataTable';
import { useRedeem } from '@/hooks/useMockToken';
import { RedeemTokenInfoType, TokenDetails } from '@/global/types';

export default function FaucetsPage() {
  const { tokens } = TokenList;
  const [redeemTokenInfo, setRedeemTokenInfo] = useState<RedeemTokenInfoType>();
  const { isLoading } = useRedeem(redeemTokenInfo);

  const handleRedeem = (token: TokenDetails) => {
    setRedeemTokenInfo({
      address: token.address,
      id: uuid(),
    });
  };

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12"> Faucets </Txt.Heading1>
        </div>
        <div tw="flex flex-col justify-center items-center gap-3 self-center max-width[616px] text-center">
          <Txt.Body2Regular tw="text-secondary-200 mb-9">
            They describe a universe consisting of bodies moving with clockwork
            predicatability on a stage of absolute space and time.
          </Txt.Body2Regular>
          <DataTable
            head={[
              {
                id: 'token',
                content: 'Token',
              },
              {
                id: 'action',
                content: '',
              },
            ]}
            data={tokens.map((token) => ({
              token: (
                <Txt.TokenText symbol={token.symbol} tw="text-left">
                  {token.symbol}
                </Txt.TokenText>
              ),
              action: (
                <div
                  onClick={(e) => e.stopPropagation()}
                  tw="flex flex-row justify-end items-center"
                >
                  {redeemTokenInfo &&
                  redeemTokenInfo.address === token.address &&
                  isLoading ? (
                    <ClipLoader color={'#ffffff'} loading size={24} tw="mr-8" />
                  ) : (
                    <button
                      onClick={() => !isLoading && handleRedeem(token)}
                      disabled={isLoading}
                      css={[
                        tw`rounded-lg py-1 px-2 border-1 border-primary-400 text-font-100 hover:bg-primary-300 transition-all transition-duration[200ms] disabled:opacity-50`,
                      ]}
                    >
                      Redeem
                    </button>
                  )}
                </div>
              ),
            }))}
            loading={false}
            hoverable
          />
        </div>
      </div>
    </Container>
  );
}
