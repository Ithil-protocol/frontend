/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useEffect, useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';

import Modal from 'src/components/based/Modal';
import Txt from 'src/components/based/Txt';
import InputField from 'src/components/based/InputField';
import { PoolDetails } from 'src/global/types';
import { BALANCER_POOLS } from 'src/global/ithil';

interface IPoolModal {
  open: boolean;
  availablePools?: PoolDetails[];
  selectedPool?: PoolDetails;
  onClose: () => void;
  onSelect(pool: PoolDetails): void;
}

const PoolModal: FC<IPoolModal> = ({
  open,
  availablePools,
  selectedPool,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState('');
  const [filteredPoolList, setFilteredPoolList] = useState<PoolDetails[]>(
    availablePools ?? BALANCER_POOLS
  );

  useEffect(() => {
    if (availablePools) {
      setSearch('');
      setFilteredPoolList(availablePools);
    }
  }, [availablePools]);

  const searchOnChange = (value: string) => {
    if (!availablePools) return;
    setSearch(value);

    const val = value.trim().toLowerCase();
    setFilteredPoolList(
      availablePools.filter(({ name }) =>
        name.trim().includes(val.toUpperCase())
      )
    );
  };

  return (
    <Modal tw="bg-secondary [width:600px]" open={open} onClose={onClose}>
      <div tw="flex flex-row justify-center items-center w-full">
        <Txt.Heading2 tw="self-end">Select a pool</Txt.Heading2>
      </div>
      <InputField
        value={search}
        onChange={(value) => searchOnChange(value)}
        renderRight={<MagnifyingGlass tw="text-secondary" />}
      />
      <div tw="w-full [height:1px] bg-primary-300 my-4"></div>
      <div tw="w-full [height:384px] overflow-y-auto">
        {filteredPoolList.map((pool) => {
          return (
            <div
              key={pool.name}
              css={[
                tw`w-full flex flex-row justify-between cursor-pointer`,
                pool === selectedPool && tw`opacity-50 cursor-default`,
              ]}
              onClick={() => pool !== selectedPool && onSelect(pool)}
            >
              <div tw="flex flex-row justify-start items-center p-0 my-2">
                {pool.logoURI ? (
                  <img tw="w-8 h-8 mr-4" src={pool.logoURI} alt="token image" />
                ) : (
                  <div tw="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center mr-4">
                    <Txt.Body2Bold>?</Txt.Body2Bold>
                  </div>
                )}
                <div tw="flex flex-col justify-start">
                  <Txt.Body2Regular>{pool.name}</Txt.Body2Regular>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default PoolModal;
