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
import { getStrategyByType, getTokenByAddress } from '@/global/utils';
import { STRATEGIES } from '@/global/constants';
import YearnChart from '@/components/composed/trade/YearnChart';

export default function PositionDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const positionId = useMemo(
    () => searchParams.get('id')?.split('_')[0],
    [searchParams]
  );
  const strategyType = useMemo(
    () => searchParams.get('id')?.split('_')[1],
    [searchParams]
  );
  const selectedStrategy =
    getStrategyByType(strategyType || 'margin') ||
    STRATEGIES.MarginTradingStrategy;
  const positionDetails = usePositions(Number(positionId), selectedStrategy);

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
      return (
        getTokenByAddress(positionDetails.heldToken) ||
        (spentToken && {
          name: `Yearn ${spentToken.name}`,
          address: positionDetails.heldToken,
          symbol: `y${spentToken.symbol}`,
          decimals: spentToken.decimals,
          logoURI: undefined,
        })
      );
    }
    return null;
  }, [positionDetails, spentToken]);
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
        strategy={selectedStrategy}
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
              {investmentToken && collateralToken && (
                <>
                  <div tw="relative mr-3">
                    <div tw="w-9 h-9 border-radius[100%] bg-primary-100 absolute bottom[0] left[28px] z-index[2]"></div>
                    {investmentToken && investmentToken.logoURI ? (
                      <img
                        tw="w-9 h-9 z-index[3]"
                        src={investmentToken.logoURI}
                        alt={investmentToken?.symbol}
                      />
                    ) : (
                      <div tw="w-9 h-9 bg-primary-400 rounded-full z-index[3] flex items-center justify-center">
                        <Txt.Body2Bold>?</Txt.Body2Bold>
                      </div>
                    )}
                    {collateralToken ? (
                      <img
                        tw="w-9 h-9 left-8 bottom-0 absolute z-index[4]"
                        src={collateralToken?.logoURI}
                        alt={collateralToken?.symbol}
                      />
                    ) : (
                      <div tw="w-9 h-9 bg-primary-400 rounded-full left-8 bottom-0 absolute z-index[4] flex items-center justify-center">
                        <Txt.Body2Bold>?</Txt.Body2Bold>
                      </div>
                    )}
                  </div>{' '}
                  {`${investmentToken?.symbol}/${collateralToken?.symbol}`}
                </>
              )}
            </Txt.Heading1>
          </div>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col w-full desktop:w-4/12">
              {positionDetails && (
                <PositionDetailsWidget
                  details={positionDetails}
                  strategy={selectedStrategy}
                />
              )}
              {positionId && (
                <PositionControlPanel
                  onClosePosition={() => setClosePositionModalOpened(true)}
                />
              )}
            </div>
            {collateralToken &&
              investmentToken &&
              (strategyType === 'margin' ? (
                <ChartCard
                  firstToken={investmentToken}
                  secondToken={collateralToken}
                  disableTrading={false}
                />
              ) : (
                <YearnChart spentToken={collateralToken} />
              ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
