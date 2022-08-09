/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useMemo, useState } from 'react';

import StakeControlPanel from '@/components/composed/stake/StakeControlPanel';
import { ITableRow } from '@/components/based/table/DataTable';
import Txt from '@/components/based/Txt';
import { formatAmount, getTokenByAddress } from '@/global/utils';
import { useBalance, useVaultData } from '@/hooks/useVault';
import { useTotalSupply } from '@/hooks/useMockToken';

type IStakeTableRow = ITableRow;

const StakeTableRow: FC<IStakeTableRow> = ({ head, row, hoverable }) => {
  const [expanded, setExpanded] = useState(false);
  const vaultTokenAddress = row['token_address'] as string;
  const vaultToken = getTokenByAddress(vaultTokenAddress);
  const vaultBalance = useBalance(vaultTokenAddress);
  const vaultData = useVaultData(vaultTokenAddress);
  const wrappedTokenSupply = useTotalSupply(vaultData?.wrappedToken);

  const shareValue = useMemo(() => {
    if (wrappedTokenSupply.isZero()) return null;
    return vaultBalance.dividedBy(wrappedTokenSupply);
  }, [vaultBalance, wrappedTokenSupply]);

  const aprValue = useMemo(() => {
    if (!shareValue || !vaultData?.creationTime) return null;
    const passedTime =
      Math.floor(new Date().getTime() / 1000) -
      Number(vaultData?.creationTime.toString());
    return shareValue
      .minus(1)
      .multipliedBy(31536000)
      .dividedBy(passedTime)
      .multipliedBy(100)
      .toFixed(2);
  }, [shareValue, vaultData?.creationTime]);

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
                    {aprValue ? `${aprValue}%` : 'N/A'}
                  </Txt.Body2Regular>
                </td>
              );
            case 'total_value':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Regular>
                    {formatAmount(vaultBalance)}
                  </Txt.Body2Regular>
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
            <StakeControlPanel token={vaultToken} />
          </td>
        </tr>
      )}
    </>
  );
};

export default StakeTableRow;
