/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';

import Tooltip from '@/components/based/Tooltip';
import Txt from '@/components/based/Txt';

interface IInfoItemText {
  value: string | number;
}

const InfoItemText: FC<IInfoItemText> = ({ value }) => {
  return <Txt.Body2Regular tw="text-secondary">{value}</Txt.Body2Regular>;
};

interface IInfoItem {
  label: string;
  details?: string;
  value: string | number | undefined;
  valueColor?: 'black' | 'red' | 'green';
  tooltipText?: string;
}

const InfoItem: FC<IInfoItem> = ({
  label,
  details,
  value,
  valueColor,
  tooltipText,
}) => {
  return (
    <div tw="flex flex-row justify-between w-full">
      <div tw="flex gap-2 items-center">
        <InfoItemText value={label} />
        {tooltipText && <Tooltip text={tooltipText} />}
      </div>
      <div tw="flex flex-row gap-2">
        {details && <InfoItemText value={details} />}
        {value && (
          <Txt.Body2Bold
            css={[
              tw`text-secondary ml-2`,
              valueColor === 'green' && tw`text-success`,
              valueColor === 'red' && tw`text-error`,
            ]}
          >
            {value}
          </Txt.Body2Bold>
        )}
      </div>
    </div>
  );
};

export default InfoItem;
