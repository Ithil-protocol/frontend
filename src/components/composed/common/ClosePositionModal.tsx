/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useMemo } from 'react';
// import { ArrowRight } from 'phosphor-react';

import Modal from '@/components/based/Modal';
import Txt from '@/components/based/Txt';
import Button from '@/components/based/Button';
import InfoItem from '@/components/composed/trade/InfoItem';
import { usePositions } from '@/hooks/usePositions';
import { useClosePosition } from '@/hooks/useClosePosition';
import { useQuoter } from '@/hooks/useQuoter';
import useMarginTradingPositionDetails from '@/hooks/useMarginTradingPositionDetails';
import { INIT_POSITION_VALUE } from '@/global/constants';
import { formatAmount } from '@/global/utils';
import { OpenedPositionType } from '@/global/types';
import { STRATEGIES } from '@/global/constants';

interface IClosePositionModal {
  open: boolean;
  onClose(): void;
  selectedId: number;
}

const ClosePositionModal: FC<IClosePositionModal> = ({
  open,
  onClose,
  selectedId,
}) => {
  const _position = usePositions(selectedId, STRATEGIES.MarginTradingStrategy);
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
  } = useMarginTradingPositionDetails(activePosition);
  const { closePosition, isLoading } = useClosePosition(
    STRATEGIES.MarginTradingStrategy
  );

  const quoteValue = useQuoter(
    longShortValue === 'Long'
      ? activePosition.heldToken
      : activePosition.owedToken,
    longShortValue === 'Long'
      ? activePosition.owedToken
      : activePosition.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue.plus(feesValue),
    STRATEGIES.MarginTradingStrategy
  );

  const maxOrMin = useMemo(() => {
    return quoteValue.multipliedBy(
      1 +
        (longShortValue === 'Long' ? -1 : 1) *
          parseFloat(STRATEGIES.MarginTradingStrategy.defaultSlippage)
    );
  }, [longShortValue, quoteValue]);

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
          {openPriceValue && (
            <InfoItem label="Open price" value={openPriceValue.toFixed(2)} />
          )}
          {currentPriceValue && (
            <InfoItem
              label="Current price"
              value={currentPriceValue.toFixed(2)}
            />
          )}
          <InfoItem
            label="Fees"
            value={formatAmount(feesValue, collateralToken?.decimals)}
          />
          <InfoItem label="Profit" value={pnlText} />
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
