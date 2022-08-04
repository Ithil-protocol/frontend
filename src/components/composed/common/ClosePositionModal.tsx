/** @jsxImportSource @emotion/react */
import React, { FC } from 'react';
import 'twin.macro';
import { ArrowRight } from 'phosphor-react';

import Modal from '@/components/based/Modal';
import Txt from '@/components/based/Txt';
import Button from '@/components/based/Button';
import InfoItem from '@/components/composed/trade/InfoItem';

interface IClosePositionModal {
  open: boolean;
  onClose(): void;
}

const ClosePositionModal: FC<IClosePositionModal> = ({ open, onClose }) => {
  return (
    <Modal tw="bg-secondary" open={open} onClose={onClose}>
      <div tw="flex flex-col justify-center items-center">
        <Txt.Heading2 tw="self-end">Confirm trade</Txt.Heading2>
      </div>
      <div tw="w-full h-auto">
        <div tw="flex flex-col justify-between items-center rounded-xl py-4 px-2 bg-primary-100 gap-2">
          <div tw="flex flex-row items-center justify-between w-full mb-9 mt-4">
            <div tw="flex flex-col">
              <Txt.TokenText symbol="WETH">ETH</Txt.TokenText>
              <Txt.Body1Bold>0.1239843</Txt.Body1Bold>
            </div>
            <ArrowRight
              size={28}
              tw="text-font-200 mx-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s]"
            />
            <div tw="flex flex-col">
              <Txt.TokenText symbol="DAI">DAI</Txt.TokenText>
              <Txt.Body1Bold>104.1920</Txt.Body1Bold>
            </div>
          </div>
          <InfoItem label="Leverage" value="2x" />
          <InfoItem label="Borrowing" value="40.54 USDC" />
          <InfoItem label="Minimum received" value="80.123 USDC" />
          <InfoItem label="DEX" value="Uniswap V2" />
          <InfoItem label="Entry fees" value="5.46 USD" />
          <div tw="flex flex-row gap-3 w-full my-4">
            <div tw="bg-primary-200 rounded-lg px-4 py-3 box-border flex flex-col w-full">
              <Txt.Body2Regular>Entry Price</Txt.Body2Regular>
              <Txt.Body2Bold tw="mt-3 text-font">1.01</Txt.Body2Bold>
              <Txt.CaptionMedium tw="mt-1">USDC/USDT</Txt.CaptionMedium>
            </div>
            <div tw="bg-primary-200 rounded-lg px-4 py-3 box-border flex flex-col w-full">
              <Txt.Body2Regular>Liquidation price</Txt.Body2Regular>
              <Txt.Body2Bold tw="mt-3 text-font">1.01</Txt.Body2Bold>
              <Txt.CaptionMedium tw="mt-1">USDC/USDT</Txt.CaptionMedium>
            </div>
          </div>
          <Button
            text="Confirm"
            action
            primary
            tw="w-full mt-4"
            eventAction="confirm trade"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ClosePositionModal;
