/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useMemo } from 'react';
// import { ArrowRight } from 'phosphor-react';
import BigNumber from 'bignumber.js';

import Modal from '@/components/based/Modal';
import Txt from '@/components/based/Txt';
import Button from '@/components/based/Button';
import InfoItem from '@/components/composed/trade/InfoItem';
import { usePositions } from '@/hooks/usePositions';
import { useClosePosition } from '@/hooks/useClosePosition';
import { useQuoter } from '@/hooks/useQuoter';
import { INIT_POSITION_VALUE } from '@/global/constants';
import { formatAmount } from '@/global/utils';
import { OpenedPositionType, StrategyContractType } from '@/global/types';
import usePositionDetails from '@/hooks/usePositionDetails';

interface IClosePositionModal {
  open: boolean;
  onClose(): void;
  selectedId: number;
  strategy: StrategyContractType;
}

const ClosePositionModal: FC<IClosePositionModal> = ({
  open,
  onClose,
  selectedId,
  strategy,
}) => {
  const _position = usePositions(selectedId, strategy);
  const activePosition: OpenedPositionType = _position || INIT_POSITION_VALUE;
  const {
    longShortValue,
    openPriceValue,
    currentPriceValue,
    positionValue,
    allowanceValue,
    principalValue,
    pnlText,
    collateralToken,
    feesValue,
  } = usePositionDetails(activePosition, strategy);
  const { closePosition, isLoading } = useClosePosition(strategy);

  const quoteValue = useQuoter(
    longShortValue === 'Long'
      ? activePosition.heldToken
      : activePosition.owedToken,
    longShortValue === 'Long'
      ? activePosition.owedToken
      : activePosition.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue.plus(feesValue),
    strategy
  );

  const maxOrMin = useMemo(() => {
    if (!quoteValue) return BigNumber(0);
    return quoteValue.multipliedBy(
      1 +
        (longShortValue === 'Long' ? -1 : 1) *
          parseFloat(strategy.defaultSlippage)
    );
  }, [longShortValue, quoteValue, strategy.defaultSlippage]);

  const handleClose = () => {
    closePosition(selectedId, maxOrMin.toFixed(0));
    onClose();
  };

  return (
    <Modal tw="bg-secondary" open={open} onClose={onClose}>
      <div tw="flex flex-col justify-center items-center">
        <Txt.Heading2 tw="self-end">Close position</Txt.Heading2>
      </div>
      <div tw="w-full h-auto">
        <div tw="flex flex-col justify-between items-center rounded-xl py-4 px-2 bg-primary-100 gap-2">
          {/* <div tw="flex flex-row items-center justify-between w-full mb-9 mt-4">
            {collateralToken && (
              <div tw="flex flex-col">
                <Txt.TokenText symbol={collateralToken.symbol}>
                  {collateralToken.symbol}
                </Txt.TokenText>
                <Txt.Body1Bold>
                  {formatAmount(collateralValue, collateralToken?.decimals)}
                </Txt.Body1Bold>
              </div>
            )}
            <ArrowRight
              size={28}
              tw="text-font-200 mx-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s]"
            />
            <div tw="flex flex-col">
              <Txt.TokenText symbol={tokenPairValue.split('/')[1]}>
                {tokenPairValue.split('/')[1]}
              </Txt.TokenText>
              <Txt.Body1Bold>-</Txt.Body1Bold>
            </div>
          </div> */}
          <InfoItem label="Position" value={positionValue} />
          <InfoItem
            label="Open price"
            value={
              openPriceValue && !openPriceValue.isNaN()
                ? openPriceValue.toFixed(4)
                : null
            }
          />
          <InfoItem
            label="Current price"
            value={
              currentPriceValue && !currentPriceValue.isNaN()
                ? currentPriceValue.toFixed(4)
                : null
            }
          />
          <InfoItem
            label="Fees"
            value={
              !feesValue.isZero()
                ? formatAmount(feesValue, collateralToken?.decimals)
                : null
            }
          />
          <InfoItem
            label="Profit"
            value={pnlText.includes('NaN') ? null : pnlText}
          />
          {/* <div tw="flex flex-row gap-3 w-full my-4">
            <div tw="bg-primary-200 rounded-lg px-4 py-3 box-border flex flex-col w-full">
              <Txt.Body2Regular>Entry Price</Txt.Body2Regular>
              <Txt.Body2Bold tw="mt-3 text-font">1.01</Txt.Body2Bold>
              <Txt.CaptionMedium tw="mt-1">{tokenPairValue}</Txt.CaptionMedium>
            </div>
            <div tw="bg-primary-200 rounded-lg px-4 py-3 box-border flex flex-col w-full">
              <Txt.Body2Regular>Liquidation price</Txt.Body2Regular>
              <Txt.Body2Bold tw="mt-3 text-font">1.01</Txt.Body2Bold>
              <Txt.CaptionMedium tw="mt-1">{tokenPairValue}</Txt.CaptionMedium>
            </div>
          </div> */}
          <Button
            text="Close"
            action
            primary
            onClick={handleClose}
            isLoading={isLoading}
            tw="w-full mt-4 bg-error hover:bg-error"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ClosePositionModal;
