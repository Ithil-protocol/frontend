/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import Skeleton from 'react-loading-skeleton';
import { PulseLoader } from 'react-spinners';

import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import TradingChart from '@/components/composed/trade/TradingChart';
import APYChart from '@/components/composed/trade/APYChart';
import PositionDetailsWidget, {
  SkeletonPositionDetailsWidget,
} from '@/components/composed/dashboard/PositionDetailsWidget';
import PositionControlPanel from '@/components/composed/dashboard/PositionControlPanel';
import { usePositions } from '@/hooks/usePositions';
import ClosePositionModal from '@/components/composed/common/ClosePositionModal';
import { getStrategyByType, getTokenByAddress } from '@/global/utils';
import { STRATEGIES } from '@/global/ithil';
import { useTheme } from '@/state/application/hooks';
import { useChainId } from '@/hooks';

export default function PositionDetails() {
  const theme = useTheme();
  const navigate = useNavigate();
  const chainId = useChainId();
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
    getStrategyByType(strategyType || 'margin', chainId) ||
    STRATEGIES[chainId].MarginTradingStrategy;
  const positionDetails = usePositions(Number(positionId), selectedStrategy);

  const [closePositionModalOpened, setClosePositionModalOpened] =
    useState(false);

  const spentToken = useMemo(() => {
    if (positionDetails?.owedToken) {
      return getTokenByAddress(positionDetails.owedToken, chainId);
    }
    return null;
  }, [chainId, positionDetails?.owedToken]);
  const obtainedToken = useMemo(() => {
    if (positionDetails?.heldToken) {
      return (
        getTokenByAddress(positionDetails.heldToken, chainId) ||
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
  }, [chainId, positionDetails?.heldToken, spentToken]);
  const collateralToken = useMemo(() => {
    if (positionDetails?.collateralToken) {
      return getTokenByAddress(positionDetails.collateralToken, chainId);
    }
    return null;
  }, [chainId, positionDetails?.collateralToken]);
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
              {investmentToken && collateralToken ? (
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
              ) : (
                <div tw="relative mr-3 w-48">
                  <Skeleton count={1} inline />
                </div>
              )}
            </Txt.Heading1>
          </div>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col w-full desktop:w-4/12">
              {positionDetails ? (
                <PositionDetailsWidget
                  details={positionDetails}
                  strategy={selectedStrategy}
                />
              ) : (
                <SkeletonPositionDetailsWidget />
              )}
              {positionId && collateralToken && (
                <PositionControlPanel
                  positionId={positionId}
                  strategy={selectedStrategy}
                  token={collateralToken}
                  onClosePosition={() => setClosePositionModalOpened(true)}
                />
              )}
            </div>
            {collateralToken && investmentToken ? (
              strategyType === 'margin' ? (
                <TradingChart
                  firstToken={investmentToken}
                  secondToken={collateralToken}
                  disableTrading={false}
                />
              ) : (
                <APYChart spentToken={collateralToken} />
              )
            ) : (
              <div tw="w-full height[500px] max-height[500px] box-content desktop:w-8/12 flex flex-col items-center rounded-xl p-5 desktop:p-10 bg-primary-100 desktop:pb-16 justify-center">
                <PulseLoader
                  color={theme === 'dark' ? '#ffffff8d' : '#0000008d'}
                  size={10}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
