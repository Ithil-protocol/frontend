/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { TokenPair } from 'src/components/composed/dashboard/TableCell';
import { ITableRow } from 'src/components/based/table/DataTable';
import RiskPercentBalls from 'src/components/composed/trade/RiskPercentCircles';
import Txt from 'src/components/based/Txt';

type ITradeTableRow = ITableRow;

const TradeTableRow: FC<ITradeTableRow> = ({ head, row }) => {
  const navigate = useNavigate();

  return (
    <>
      <tr
        css={[
          tw`cursor-pointer bg-primary-100 transition-all transition-duration[300ms] border-b-1 border-b-primary-300 last:border-b-0`,
        ]}
      >
        {head.map((headCell) => {
          switch (headCell.id) {
            case 'action':
              return (
                <td key={headCell.id} css={tw`py-4 text-center`}>
                  <button
                    css={[
                      tw`rounded-lg py-1 px-2 border-1 border-primary-400 min-width[60px] text-font-100 hover:bg-primary-200 transition-all transition-duration[200ms] disabled:opacity-50 disabled:pointer-events-none`,
                    ]}
                    onClick={() => navigate(row['url'] as string)}
                    disabled={(row['url'] as string) === ''}
                  >
                    Go
                  </button>
                </td>
              );
            case 'exposure':
              return (
                <td key={headCell.id} css={tw`py-4 text-center`}>
                  <TokenPair
                    investmentTokenSymbol={'WETH'}
                    collateralTokenSymbol={'WETH'}
                    noText
                  />
                </td>
              );
            case 'title':
              return (
                <td
                  key={headCell.id}
                  css={tw`py-4 max-width[100px] text-center`}
                >
                  <Txt.Body2Regular>{row[headCell.id]}</Txt.Body2Regular>
                </td>
              );
            case 'description':
              return (
                <td
                  key={headCell.id}
                  css={tw`py-4 max-width[150px] text-center`}
                >
                  <Txt.Body2Regular tw="font-size[small]">
                    {row[headCell.id]}
                  </Txt.Body2Regular>
                </td>
              );
            case 'risk_profile':
              return (
                <td key={headCell.id} css={tw`py-4 max-width[150px] `}>
                  <RiskPercentBalls value={row[headCell.id] as number} />
                </td>
              );
            case 'utilisation_rate':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer text-center`}>
                  <Txt.Body2Regular tw="text-success">{`${
                    row[headCell.id]
                  }%`}</Txt.Body2Regular>
                </td>
              );
            default:
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer text-center`}>
                  <Txt.Body2Regular>{row[headCell.id]}</Txt.Body2Regular>
                </td>
              );
          }
        })}
      </tr>
    </>
  );
};

export default TradeTableRow;
