/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';

interface IRiskPercentCircles {
  value: number;
  max?: number;
}

const RiskPercentCircles: FC<IRiskPercentCircles> = ({ value, max = 5 }) => {
  return (
    <div tw="flex flex-row items-center gap-x-1 justify-center">
      {[...Array(max)].map((_, idx) => (
        <div
          css={[
            tw`rounded-full border-success border-1 w-5 h-5 block`,
            idx < value ? tw`bg-success` : tw`background[transparent]`,
          ]}
          key={idx}
        ></div>
      ))}
    </div>
  );
};

export default RiskPercentCircles;
