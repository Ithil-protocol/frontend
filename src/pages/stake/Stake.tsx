/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useMemo, useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';

import Txt from 'src/components/based/Txt';
import Page from 'src/components/based/Page';
import DataTable from 'src/components/based/table/DataTable';
import SortButton from 'src/components/composed/stake/SortButton';
import { KeyableType } from 'src/global/types';
import Button from 'src/components/based/Button';
import InputField from 'src/components/based/InputField';
import Tooltip from 'src/components/based/Tooltip';
import StakeTableRow from 'src/components/composed/stake/StakeTableRow';
import { TOKEN_LIST } from 'src/global/ithil';
import { useVaultsState } from 'src/state/vaults/hooks';
import { formatAmountToNumber } from 'src/global/utils';
import { useChainId } from 'src/hooks';

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
  const vaults = useVaultsState();
  const chainId = useChainId();

  const apySortLabel = useMemo(
    () => `APY${apySortValue ? ` - ${APY_MENU[apySortValue]}` : ''}`,
    [apySortValue]
  );
  const tvlSortLabel = useMemo(
    () => `TVL${tvlSortValue ? ` - ${TVL_MENU[tvlSortValue]}` : ''}`,
    [tvlSortValue]
  );

  const sortedTokens = useMemo(() => {
    if (apySortValue === '' && tvlSortValue === '')
      return [...TOKEN_LIST[chainId]];
    return [...TOKEN_LIST[chainId]].sort((a, b) => {
      let result = 0;
      if (apySortValue) {
        const diffValue = (vaults[b.address].apr - vaults[a.address].apr) * 100;
        result = apySortValue === 'highest' ? diffValue : -diffValue;
      }
      if (tvlSortValue) {
        const comparedVaule = formatAmountToNumber(
          vaults[b.address].tvl,
          b.decimals
        ).comparedTo(formatAmountToNumber(vaults[a.address].tvl, a.decimals));
        result += tvlSortValue === 'highest' ? comparedVaule : -comparedVaule;
      }
      return result;
    });
  }, [apySortValue, chainId, tvlSortValue, vaults]);

  const handleSortClear = () => {
    setApySortValue('');
    setTvlSortValue('');
  };

  return (
    <Page heading="Stake">
      <div
        css={[
          tw`flex justify-center gap-3 self-start mb-4 whitespace-nowrap`,
          tw`mobile:flex-col mobile:w-full mobile:items-start`,
          tw`tablet:items-center tablet:flex-row tablet:[width:initial]`,
        ]}
      >
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
        <div tw="flex justify-center items-center gap-3">
          <Txt.Body1Regular tw="mobile:hidden tablet:[display:initial]">
            Sort by:
          </Txt.Body1Regular>
          <SortButton
            buttonLabel={apySortLabel}
            selected={!!apySortValue}
            menu={APY_MENU}
            tw="mobile:w-full tablet:w-auto"
            onChange={(val) => setApySortValue(val)}
          />
          <SortButton
            buttonLabel={tvlSortLabel}
            selected={!!tvlSortValue}
            menu={TVL_MENU}
            onChange={(val) => setTvlSortValue(val)}
          />
        </div>
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
                <Txt.Body2Regular tw="text-font-100">Asset</Txt.Body2Regular>
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
                <Txt.Body2Regular tw="text-font-100">Borrowed</Txt.Body2Regular>
                <Tooltip text="How many tokens are currently lent to risk-takers" />
              </div>
            ),
          },
          {
            id: 'owned',
            content: (
              <div tw="flex items-center gap-2">
                <Txt.Body2Regular tw="text-font-100">
                  Deposited
                </Txt.Body2Regular>
              </div>
            ),
          },
          { id: 'action', content: '' },
        ]}
        data={sortedTokens
          .filter(({ symbol }) =>
            symbol.trim().includes(searchInputValue.toUpperCase())
          )
          .map((token) => ({
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
            action: null,
          }))}
        loading={false}
        hoverable
        RowComponent={StakeTableRow}
      />
    </Page>
  );
}
