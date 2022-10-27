/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useState } from 'react';
import { ArrowDown } from 'phosphor-react';

import { PoolDetails } from '@/global/types';
import Button from '@/components/based/Button';
import Txt from '@/components/based/Txt';
import PoolModal from '@/components/composed/trade/PoolModal';

interface IPoolSelect {
  onPoolChange: (pool: PoolDetails) => void;
  pool: PoolDetails;
  availablePools?: PoolDetails[];
}

const PoolSelect: FC<IPoolSelect> = ({
  onPoolChange,
  pool,
  availablePools,
}) => {
  const [poolModalOpened, setPoolModalOpened] = useState(false);

  return (
    <>
      <Button
        css={[
          tw`bg-primary-400 dark:bg-primary-300 h-6 tablet:h-7 desktop:h-8 w-full py-6`,
        ]}
        text={pool.name}
        leftIcon={() =>
          pool.logoURI ? (
            <img tw="w-4 h-4 mr-1" src={pool.logoURI} alt="token image" />
          ) : (
            <div tw="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center mr-1">
              <Txt.Body2Bold>?</Txt.Body2Bold>
            </div>
          )
        }
        rightIcon={ArrowDown}
        onClick={() => setPoolModalOpened(true)}
      />
      <PoolModal
        availablePools={availablePools}
        open={poolModalOpened}
        onClose={() => {
          setPoolModalOpened(false);
        }}
        onSelect={(pool) => {
          onPoolChange(pool);
          setPoolModalOpened(false);
        }}
      />
    </>
  );
};

export default PoolSelect;
