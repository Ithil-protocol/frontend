/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { v4 as uuid } from 'uuid';
import { Bathtub, Plus } from 'phosphor-react';

import Txt from '@/components/based/Txt';
import DataTable from '@/components/based/table/DataTable';
import Page from '@/components/based/Page';
import { useRedeem } from '@/hooks/useToken';
import { RedeemTokenInfoType, TokenDetails } from '@/global/types';
import { TOKEN_LIST } from '@/global/constants';
import { importToken } from '@/global/utils';

export default function FaucetsPage() {
  const [redeemTokenInfo, setRedeemTokenInfo] = useState<RedeemTokenInfoType>();
  const { isLoading } = useRedeem(redeemTokenInfo);

  const handleRedeem = (token: TokenDetails) => {
    setRedeemTokenInfo({
      address: token.address,
      id: uuid(),
    });
  };

  const handleRowClick = (token: TokenDetails) => {
    importToken(token);
  };

  return (
    <Page
      heading="Faucets"
      description="Get some test ERC20 here and play with the testnet strategies"
    >
      <div tw="flex flex-col justify-center items-center gap-3 self-center laptop:min-width[350px] laptop:w-auto laptop:max-width[616px] mobile:max-width[350px] mobile:min-width[initial] mobile:w-full text-center">
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
          data={TOKEN_LIST.map((token) => ({
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
                <button
                  css={[
                    tw`rounded-full py-1 px-1 mr-2 border-1 border-primary-400 text-font-100 hover:bg-primary-300 transition-all transition-duration[200ms] disabled:opacity-50`,
                  ]}
                  onClick={() => handleRowClick(token)}
                >
                  <Plus />
                </button>

                <button
                  onClick={() => !isLoading && handleRedeem(token)}
                  disabled={isLoading}
                  css={[
                    tw`rounded-lg py-1 px-2 border-1 tablet:width[80px] mobile:width[35px] height[35px] flex items-center justify-center border-primary-400 text-font-100 hover:bg-primary-300 transition-all transition-duration[200ms] disabled:opacity-50`,
                  ]}
                  id="redeem"
                >
                  {redeemTokenInfo &&
                  redeemTokenInfo.address === token.address &&
                  isLoading ? (
                    <ClipLoader color={'#ffffff'} loading size={24} />
                  ) : (
                    <>
                      <span tw="mobile:hidden tablet:display[initial]">
                        Redeem
                      </span>
                      <Bathtub tw="tablet:hidden mobile:display[initial]" />
                    </>
                  )}
                </button>
              </div>
            ),
          }))}
          loading={false}
          hoverable
          overflow={false}
        />
      </div>
    </Page>
  );
}
