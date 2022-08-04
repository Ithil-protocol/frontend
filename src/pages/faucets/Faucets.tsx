/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React from 'react';

import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import DataTable from '@/components/based/table/DataTable';

export default function FaucetsPage() {
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
            data={[
              {
                token: (
                  <Txt.TokenText symbol="WETH" tw="text-left">
                    ETH
                  </Txt.TokenText>
                ),
                action: (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    tw="flex flex-row justify-end"
                  >
                    <button
                      onClick={() => console.log('Redeem')}
                      css={[
                        tw`rounded-lg py-1 px-2 border-1 border-primary-400 text-font-100 hover:bg-primary-200 transition-all transition-duration[200ms]`,
                      ]}
                    >
                      Redeem
                    </button>
                  </div>
                ),
              },
              {
                token: (
                  <Txt.TokenText symbol="DAI" tw="text-left">
                    DAI
                  </Txt.TokenText>
                ),
                action: (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    tw="flex flex-row justify-end"
                  >
                    <button
                      onClick={() => console.log('Redeem')}
                      css={[
                        tw`rounded-lg py-1 px-2 border-1 border-primary-400 text-font-100 hover:bg-primary-200 transition-all transition-duration[200ms]`,
                      ]}
                    >
                      Redeem
                    </button>
                  </div>
                ),
              },
            ]}
            loading={false}
            hoverable
          />
        </div>
      </div>
    </Container>
  );
}
