/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import BigNumber from 'bignumber.js';

import { useBalance, useVaultData } from '@/hooks/useVault';
import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import ChartCard from '@/components/composed/trade/ChartCard';
import { formatAmount, getTokenByAddress } from '@/global/utils';
import { useTotalSupply } from '@/hooks/useToken';

export interface IBanner {
  heading: string | number;
  body: string | number;
}

const Banner: FC<IBanner> = ({ heading, body }) => {
  return (
    <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
      <Txt.Heading2 tw="mb-4">{heading}</Txt.Heading2>
      <div tw="flex flex-row justify-between w-full">
        <div tw="flex gap-2 items-center">
          <Txt.Body2Regular tw="text-secondary">{body}</Txt.Body2Regular>
        </div>
      </div>
    </div>
  );
};

export default function VaultDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const vaultToken = getTokenByAddress(token);
  const vaultBalance = useBalance(token);
  const vaultData = useVaultData(token);
  const wrappedTokenSupply = useTotalSupply(vaultData?.wrappedToken);

  const utilisationRate = useMemo(() => {
    if (!vaultData?.netLoans || vaultBalance.isZero()) return 0;
    return BigNumber(vaultData?.netLoans.toString()).div(vaultBalance);
  }, [vaultData?.netLoans]);

  const shareValue = useMemo(() => {
    if (wrappedTokenSupply.isZero()) return null;
    return vaultBalance.dividedBy(wrappedTokenSupply);
  }, [vaultBalance, wrappedTokenSupply]);

  const aprValue = useMemo(() => {
    if (!shareValue || !vaultData?.creationTime) return null;
    const passedTime =
      Math.floor(new Date().getTime() / 1000) -
      Number(vaultData?.creationTime.toString());
    const value = shareValue
      .minus(1)
      .multipliedBy(31536000)
      .dividedBy(passedTime)
      .multipliedBy(100);

    if (value.gt(0)) return value.toFixed(2);
    else return 0;
  }, [shareValue, vaultData?.creationTime]);

  useEffect(() => {
    if (!token) navigate('/stake');
  }, []);

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <div tw="flex flex-row items-baseline w-full">
            <ArrowLeft
              size={28}
              tw="text-font-200 mr-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s] float-left"
              onClick={() => navigate('/stake')}
            />
            <Txt.Heading1 tw="mb-12 flex flex-row justify-center items-center gap-8 flex-grow -ml-8">
              <img
                tw="w-9 h-9"
                src={vaultToken?.logoURI}
                alt={vaultToken?.symbol}
              />
              {vaultToken?.symbol} Vault Details
            </Txt.Heading1>
          </div>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col w-full desktop:w-4/12">
              <div tw="flex flex-col w-full mb-3">
                <Banner
                  heading="TVL"
                  body={`${formatAmount(vaultBalance, vaultToken?.decimals)} ${
                    vaultToken?.symbol
                  }`}
                />
              </div>
              <div tw="flex flex-col w-full mb-3">
                <Banner
                  heading="Utilisation Rate"
                  body={`${utilisationRate.toFixed(2)}%`}
                />
              </div>
              <div tw="flex flex-col w-full mb-3">
                <Banner
                  heading="Revenues"
                  body={`${formatAmount(
                    vaultData?.currentProfits.toString(),
                    vaultToken?.decimals
                  )} ${vaultToken?.symbol}`}
                />
              </div>
              <div tw="flex flex-col w-full mb-3">
                <Banner
                  heading="Insurance Reserve"
                  body={`${formatAmount(
                    vaultData?.insuranceReserveBalance.toString(),
                    vaultToken?.decimals
                  )} ${vaultToken?.symbol} (optimal ratio: ${
                    vaultData?.optimalRatio
                  })`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
