/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useEthers, useTokenBalance } from '@usedapp/core';
import Skeleton from 'react-loading-skeleton';

import StakeControlPanel from 'src/components/composed/stake/StakeControlPanel';
import { ITableRow } from 'src/components/based/table/DataTable';
import Txt from 'src/components/based/Txt';
import { formatAmount, getTokenByAddress } from 'src/global/utils';
import { useBalance, useVaultData } from 'src/hooks/useVault';
import { useTotalSupply } from 'src/hooks/useToken';
import { useUpdateVaultStatus } from 'src/state/vaults/hooks';
import { useChainId } from 'src/hooks';

type IStakeTableRow = ITableRow;

const StakeTableRow: FC<IStakeTableRow> = ({ head, row, hoverable }) => {
  const navigate = useNavigate();
  const { account } = useEthers();
  const chainId = useChainId();
  const [expanded, setExpanded] = useState(false);
  const vaultTokenAddress = row['token_address'] as string;
  const vaultToken = getTokenByAddress(vaultTokenAddress, chainId);
  const vaultBalance = useBalance(vaultTokenAddress);
  const vaultData = useVaultData(vaultTokenAddress);
  const wrappedTokenBalance = useTokenBalance(vaultData?.wrappedToken, account);
  const wrappedTokenSupply = useTotalSupply(vaultData?.wrappedToken);
  const updateVaultStatus = useUpdateVaultStatus();

  const tvl = useMemo(() => {
    return vaultBalance
      .plus(BigNumber(vaultData?.boostedAmount.toString()))
      .plus(BigNumber(vaultData?.insuranceReserveBalance.toString()));
  }, [vaultBalance, vaultData]);

  const totalBorrowed = useMemo(() => {
    if (!vaultData?.netLoans) return null;
    return BigNumber(vaultData?.netLoans.toString());
  }, [vaultData]);

  const shareValue = useMemo(() => {
    if (wrappedTokenSupply.isZero()) return BigNumber(0);
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
    return 0;
  }, [shareValue, vaultData?.creationTime]);

  const handleInfoClick = async () => {
    navigate(`/stake/details?token=${vaultTokenAddress}`);
  };

  useEffect(() => {
    if (aprValue !== null && tvl) {
      updateVaultStatus(vaultTokenAddress, { apr: Number(aprValue) || 0, tvl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aprValue, tvl]);

  return (
    <>
      <tr
        css={[
          tw`cursor-pointer bg-primary-100 transition-all transition-duration[300ms] border-b-1 border-b-primary-300 last:border-b-0`,
          hoverable && tw`hover:bg-primary-200`,
        ]}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {head.map((headCell) => {
          switch (headCell.id) {
            case 'annual_percentage':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Regular>
                    {aprValue !== null ? (
                      `${aprValue}%`
                    ) : (
                      <Skeleton width={60} />
                    )}
                  </Txt.Body2Regular>
                </td>
              );
            case 'total_value':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Regular>
                    {tvl.isNaN() ? (
                      <Skeleton width={60} />
                    ) : (
                      formatAmount(tvl, vaultToken?.decimals)
                    )}
                  </Txt.Body2Regular>
                </td>
              );
            case 'total_borrowed':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Regular>
                    {totalBorrowed ? (
                      formatAmount(totalBorrowed, vaultToken?.decimals)
                    ) : (
                      <Skeleton width={120} />
                    )}
                  </Txt.Body2Regular>
                </td>
              );
            case 'owned':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Regular>
                    {wrappedTokenBalance ? (
                      formatAmount(
                        wrappedTokenBalance.toString(),
                        vaultToken?.decimals
                      )
                    ) : (
                      <Skeleton width={120} />
                    )}
                  </Txt.Body2Regular>
                </td>
              );
            case 'action':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <button
                    onClick={handleInfoClick}
                    css={[
                      tw`rounded-lg py-1 px-2 border-1 border-primary-400 text-font-100 hover:bg-primary-200 transition-all transition-duration[200ms]`,
                    ]}
                  >
                    Info
                  </button>
                </td>
              );
            default:
              return (
                <td
                  key={headCell.id}
                  css={[
                    tw`py-4 cursor-pointer last:pr-4`,
                    headCell.id === 'vault_name' && tw`pl-4`,
                  ]}
                  id="stake"
                >
                  {row[headCell.id]}
                </td>
              );
          }
        })}
      </tr>
      {vaultToken && (
        <tr style={{ display: !expanded ? 'none' : undefined }}>
          <td tw="bg-primary-100" colSpan={head.length}>
            <StakeControlPanel
              token={vaultToken}
              vaultData={vaultData}
              vaultBalance={vaultBalance}
              wrappedTokenBalance={wrappedTokenBalance}
              wrappedTokenSupply={wrappedTokenSupply}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default StakeTableRow;
