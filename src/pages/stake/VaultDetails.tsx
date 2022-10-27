/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import BigNumber from 'bignumber.js';

import { useBalance, useVaultData } from '@/hooks/useVault';
import Container from '@/components/based/Container';
import Txt from '@/components/based/Txt';
import { formatAmount, getTokenByAddress } from '@/global/utils';
import { useTotalSupply } from '@/hooks/useToken';
import VaultChart from '@/components/composed/stake/VaultChart';
import { useChainId } from '@/hooks';

export interface IBanner {
  heading: string | number;
  body: string | number;
}

const Banner: FC<IBanner> = ({ heading, body }) => {
  return (
    <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
      <Txt.Heading2 tw="mb-4">{heading}</Txt.Heading2>
      <div tw="flex flex-row justify-between w-full">
        <div tw="flex gap-2 items-center justify-center w-full">
          <Txt.Body2Regular tw="text-secondary">{body}</Txt.Body2Regular>
        </div>
      </div>
    </div>
  );
};

export default function VaultDetails() {
  const navigate = useNavigate();
  const chainId = useChainId();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const vaultToken = getTokenByAddress(token, chainId);
  const vaultBalance = useBalance(token);
  const vaultData = useVaultData(token);
  const wrappedTokenSupply = useTotalSupply(vaultData?.wrappedToken);

  const utilisationRate = useMemo(() => {
    if (!vaultData || vaultBalance.isZero()) return 0;
    return BigNumber(vaultData.netLoans.toString())
      .div(
        BigNumber(vaultData.netLoans.toString())
          .plus(vaultBalance)
          .minus(BigNumber(vaultData.insuranceReserveBalance.toString() || 0))
      )
      .multipliedBy(100);
  }, [vaultBalance, vaultData]);

  const borrowable = useMemo(() => {
    if (!vaultData || vaultBalance.isZero()) return 0;
    return vaultBalance
      .minus(BigNumber(vaultData.netLoans.toString()))
      .minus(BigNumber(vaultData.insuranceReserveBalance.toString()));
  }, [vaultBalance, vaultData]);

  const shareValue = useMemo(() => {
    if (wrappedTokenSupply.isZero()) return null;
    return vaultBalance.dividedBy(wrappedTokenSupply);
  }, [vaultBalance, wrappedTokenSupply]);

  const revenues = useMemo(() => {
    return vaultBalance.minus(wrappedTokenSupply);
  }, [vaultBalance, wrappedTokenSupply]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  heading="Borrowable Balance"
                  body={`${formatAmount(borrowable, vaultToken?.decimals)} ${
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
                  body={`${formatAmount(revenues, vaultToken?.decimals)} ${
                    vaultToken?.symbol
                  }`}
                />
              </div>
              <div tw="flex flex-col w-full mb-3">
                <Banner
                  heading="Insurance Reserve"
                  body={`${formatAmount(
                    vaultData?.insuranceReserveBalance.toString(),
                    vaultToken?.decimals
                  )} ${vaultToken?.symbol}`}
                />
              </div>
            </div>
            <VaultChart
              balance={vaultBalance}
              utilisationRate={utilisationRate}
              vaultData={vaultData}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
