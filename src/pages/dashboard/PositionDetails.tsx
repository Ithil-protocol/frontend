/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';

import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import ChartCard from '@/components/composed/trade/ChartCard';
import PositionDetailsWidget from '@/components/composed/dashboard/PositionDetailsWidget';
import PositionControlPanel from '@/components/composed/dashboard/PositionControlPanel';
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

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <div tw="flex flex-row items-baseline w-full">
            <ArrowLeft
              size={28}
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
            </Txt.Heading1>
          </div>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col w-full desktop:w-4/12">
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
          </div>
        </div>
      </div>
    </Container>
  );
}
