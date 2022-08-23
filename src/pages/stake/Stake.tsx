/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useMemo, useState } from 'react';
import { ChartLine, MagnifyingGlass, Info } from 'phosphor-react';

import Txt from '@/components/based/Txt';
import Container from '@/components/based/Container';
import DataTable from '@/components/based/table/DataTable';
import SortButton from '@/components/composed/stake/SortButton';
import { KeyableType } from '@/global/types';
import Button from '@/components/based/Button';
import InputField from '@/components/based/InputField';
import Tooltip from '@/components/based/Tooltip';
import StakeTableRow from '@/components/composed/stake/StakeTableRow';
import { TOKEN_LIST } from '@/global/constants';

const APY_MENU: KeyableType = {
  highest: 'Highest',
  lowest: 'Lowest',
};
const TVL_MENU: KeyableType = {
  highest: 'Highest',
  lowest: 'Lowest',
};

export default function StakePage() {
  const [apySortValue, setApySortValue] = useState<string>('');
  const [tvlSortValue, setTvlSortValue] = useState<string>('');
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const apySortLabel = useMemo(
    () => `APY${apySortValue ? ` - ${APY_MENU[apySortValue]}` : ''}`,
    [apySortValue]
  );
  const tvlSortLabel = useMemo(
    () => `TVL${tvlSortValue ? ` - ${TVL_MENU[tvlSortValue]}` : ''}`,
    [tvlSortValue]
  );

  const handleSortClear = () => {
    setApySortValue('');
    setTvlSortValue('');
  };

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12"> Stake </Txt.Heading1>
          <div tw="flex flex-row justify-center items-center gap-3 self-start mb-4 whitespace-nowrap">
            <InputField
              tw="mr-9"
              value={searchInputValue}
              placeholder="Filter by token..."
              onChange={(val) => setSearchInputValue(val)}
              renderRight={
                <Txt.Body2Regular>
                  <MagnifyingGlass />
                </Txt.Body2Regular>
              }
            />
            <Txt.Body1Regular>Sort by:</Txt.Body1Regular>
            <SortButton
              buttonLabel={apySortLabel}
              selected={!!apySortValue}
              menu={APY_MENU}
              onChange={(val) => setApySortValue(val)}
            />
            <SortButton
              buttonLabel={tvlSortLabel}
              selected={!!tvlSortValue}
              menu={TVL_MENU}
              onChange={(val) => setTvlSortValue(val)}
            />
            {(apySortValue !== '' || tvlSortValue !== '') && (
              <Button text="Clear" secondary onClick={handleSortClear} />
            )}
          </div>
          <DataTable
            head={[
              {
                id: 'vault_name',
                content: (
                  <div tw="flex items-center gap-2">
                    <Txt.Body2Regular tw="text-font-100">
                      Asset
                    </Txt.Body2Regular>
                  </div>
                ),
              },
              {
                id: 'annual_percentage',
                content: (
                  <div tw="flex items-center gap-2">
                    <Txt.Body2Regular tw="text-font-100">APY</Txt.Body2Regular>
                    <Tooltip text="Annual Percentage Yield, your ROI on the deposit" />
                  </div>
                ),
              },
              {
                id: 'total_value',
                content: (
                  <div tw="flex items-center gap-2">
                    <Txt.Body2Regular tw="text-font-100">TVL</Txt.Body2Regular>
                    <Tooltip text="Total value locked, how many tokens have been deposited" />
                  </div>
                ),
              },
              {
                id: 'total_borrowed',
                content: (
                  <div tw="flex items-center gap-2">
                    <Txt.Body2Regular tw="text-font-100">
                      Borrowed
                    </Txt.Body2Regular>
                    <Tooltip text="How many tokens are currently lent to risk-takers" />
                  </div>
                ),
              },
              {
                id: 'owner',
                content: (
                  <div tw="flex items-center gap-2">
                    <Txt.Body2Regular tw="text-font-100">
                      Balance
                    </Txt.Body2Regular>
                  </div>
                ),
              },
            ]}
            data={TOKEN_LIST.filter(({ symbol }) =>
              symbol.trim().includes(searchInputValue.toUpperCase())
            ).map((token) => ({
              vault_name: (
                <Txt.TokenText symbol={token.symbol}>
                  {token.symbol}
                </Txt.TokenText>
              ),
              token_address: token.address,
              annual_percentage: null,
              total_value: null,
              total_borrow: null,
              owned: null,
            }))}
            loading={false}
            hoverable
            RowComponent={StakeTableRow}
          />
        </div>
      </div>
    </Container>
  );
}
