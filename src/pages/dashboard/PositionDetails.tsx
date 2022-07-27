/** @jsxImportSource @emotion/react */
import 'twin.macro';
<<<<<<< HEAD
import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
=======
import React from 'react';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';
// import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
>>>>>>> c78b5e6 (feat: add dashboard and position details UI)

import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import ChartCard from '@/components/composed/trade/ChartCard';
import PositionDetailsWidget from '@/components/composed/dashboard/PositionDetailsWidget';
import PositionControlPanel from '@/components/composed/dashboard/PositionControlPanel';
<<<<<<< HEAD
import { usePositons } from '@/hooks/useMarginTradingStrategy';
import { getTokenByAddress } from '@/global/utils';

export default function PositionDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const positionId = useMemo(() => searchParams.get('id'), [searchParams]);
  const positionDetails = usePositons(Number(positionId));

  const spentToken = useMemo(() => {
    if (positionDetails?.collateralToken) {
      return getTokenByAddress(positionDetails.collateralToken);
    }
    return null;
  }, [positionDetails]);
  const obtainedToken = useMemo(() => {
    if (positionDetails?.heldToken) {
      return getTokenByAddress(positionDetails.heldToken);
    }
    return null;
  }, [positionDetails]);
=======

export default function PositionDetails() {
  const { tokens } = TokenList;
  const spentTokenSymbol = tokens[0].symbol;
  const obtainedTokenSymbol = tokens[1].symbol;
  // const location = useLocation();
  const navigate = useNavigate();
>>>>>>> c78b5e6 (feat: add dashboard and position details UI)

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <div tw="flex flex-row items-baseline w-full">
            <ArrowLeft
              size={28}
<<<<<<< HEAD
              tw="text-font-200 mr-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s] float-left"
              onClick={() => navigate('/dashboard')}
            />
            <Txt.Heading1 tw="mb-12 flex flex-row justify-center items-center gap-8 flex-grow -ml-8">
              {spentToken && obtainedToken && (
                <>
                  <div tw="relative">
                    <div tw="w-9 h-9 border-radius[100%] bg-primary-100 absolute bottom[0] left[16px] z-index[2]"></div>
                    <img
                      tw="w-9 h-9 z-index[3]"
                      src={spentToken?.logoURI}
                      alt={spentToken?.symbol}
                    />
                    <img
                      tw="w-9 h-9 left-5 bottom-0 absolute z-index[4]"
                      src={obtainedToken?.logoURI}
                      alt={obtainedToken?.symbol}
                    />
                  </div>{' '}
                  {`${spentToken?.symbol}/${obtainedToken?.symbol}`}
                </>
              )}
=======
              tw="text-font-200 mx-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s] float-left"
              onClick={() => navigate('/dashboard')}
            />
            <Txt.Heading1 tw="mb-12 flex flex-row justify-center items-center gap-8 flex-grow -ml-8">
              <div tw="relative">
                <div tw="w-9 h-9 border-radius[100%] bg-primary-100 absolute bottom[0] left[16px] z-index[2]"></div>
                <img
                  tw="w-9 h-9 z-index[3]"
                  src={
                    tokens.find((token) => token.symbol === spentTokenSymbol)
                      ?.logoURI
                  }
                  alt={spentTokenSymbol}
                />
                <img
                  tw="w-9 h-9 left-5 bottom-0 absolute z-index[4]"
                  src={
                    tokens.find((token) => token.symbol === obtainedTokenSymbol)
                      ?.logoURI
                  }
                  alt={obtainedTokenSymbol}
                />
              </div>{' '}
              {`${spentTokenSymbol}/${obtainedTokenSymbol}`}
>>>>>>> c78b5e6 (feat: add dashboard and position details UI)
            </Txt.Heading1>
          </div>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col w-full desktop:w-4/12">
<<<<<<< HEAD
              {positionDetails && (
                <PositionDetailsWidget details={positionDetails} />
              )}
              <PositionControlPanel />
            </div>
            {spentToken && obtainedToken && (
              <ChartCard
                firstToken={spentToken}
                secondToken={obtainedToken}
                disableTrading={false}
              />
            )}
=======
              <PositionDetailsWidget />
              <PositionControlPanel />
            </div>
            <ChartCard
              firstToken={tokens[0]}
              secondToken={tokens[1]}
              disableTrading={false}
            />
>>>>>>> c78b5e6 (feat: add dashboard and position details UI)
          </div>
        </div>
      </div>
    </Container>
  );
}
