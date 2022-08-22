/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';

import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import ChartCard from '@/components/composed/trade/ChartCard';
import PositionDetailsWidget from '@/components/composed/dashboard/PositionDetailsWidget';
import PositionControlPanel from '@/components/composed/dashboard/PositionControlPanel';
import { usePositions } from '@/hooks/usePositions';
import ClosePositionModal from '@/components/composed/common/ClosePositionModal';
import { getTokenByAddress } from '@/global/utils';
import { STRATEGIES } from '@/global/constants';

export default function PositionDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const positionId = useMemo(() => searchParams.get('id'), [searchParams]);
  const positionDetails = usePositions(
    Number(positionId),
    STRATEGIES.MarginTradingStrategy
  );

  const [closePositionModalOpened, setClosePositionModalOpened] =
    useState(false);

  const spentToken = useMemo(() => {
    if (positionDetails?.owedToken) {
      return getTokenByAddress(positionDetails.owedToken);
    }
    return null;
  }, [positionDetails]);
  const obtainedToken = useMemo(() => {
    if (positionDetails?.heldToken) {
      return getTokenByAddress(positionDetails.heldToken);
    }
    return null;
  }, [positionDetails]);
  const collateralToken = useMemo(() => {
    if (positionDetails?.collateralToken) {
      return getTokenByAddress(positionDetails.collateralToken);
    }
    return null;
  }, [positionDetails]);
  const investmentToken =
    collateralToken?.address == obtainedToken?.address
      ? spentToken
      : obtainedToken;

  return (
    <Container>
      <ClosePositionModal
        open={closePositionModalOpened}
        selectedId={Number(positionId)}
        onClose={() => setClosePositionModalOpened(false)}
      />
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <div tw="flex flex-row items-baseline w-full">
            <ArrowLeft
              size={28}
              tw="text-font-200 mr-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s] float-left"
              onClick={() => navigate('/dashboard')}
            />
            <Txt.Heading1 tw="mb-12 flex flex-row justify-center items-center gap-8 flex-grow -ml-8">
              {collateralToken && investmentToken && (
                <>
                  <div tw="relative">
                    <div tw="w-9 h-9 border-radius[100%] bg-primary-100 absolute bottom[0] left[16px] z-index[2]"></div>
                    <img
                      tw="w-9 h-9 z-index[3]"
                      src={collateralToken?.logoURI}
                      alt={collateralToken?.symbol}
                    />
                    <img
                      tw="w-9 h-9 left-5 bottom-0 absolute z-index[4]"
                      src={investmentToken?.logoURI}
                      alt={investmentToken?.symbol}
                    />
                  </div>{' '}
                  {`${investmentToken?.symbol}/${collateralToken?.symbol}`}
                </>
              )}
            </Txt.Heading1>
          </div>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col w-full desktop:w-4/12">
              {positionDetails && (
                <PositionDetailsWidget details={positionDetails} />
              )}
              {positionId && (
                <PositionControlPanel
                  onClosePosition={() => setClosePositionModalOpened(true)}
                />
              )}
            </div>
            {collateralToken && investmentToken && (
              <ChartCard
                firstToken={investmentToken}
                secondToken={collateralToken}
                disableTrading={false}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
