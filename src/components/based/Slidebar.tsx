/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';
import Slider from 'rc-slider';

import Txt from './Txt';
import Tooltip from './Tooltip';
import 'rc-slider/assets/index.css';

interface ISliderBar {
  label?: string;
  min: number;
  max: number;
  marks?: any;
  onChange?: (value: number | number[]) => void;
  value: number;
  step?: number;
  tooltipText?: string;
}

const SliderBar: FC<ISliderBar> = ({
  label,
  min,
  max,
  marks,
  onChange,
  value,
  step,
  tooltipText,
}) => {
  return (
    <div tw="my-2 flex w-full flex-col gap-4">
      <div tw="flex flex-row gap-2 items-center text-font-200">
        {label && (
          <Txt.Body2Regular tw="self-start">
            {label + ':  ' + value}
          </Txt.Body2Regular>
        )}
        {tooltipText && <Tooltip text={tooltipText} />}
      </div>
      <span tw="px-2">
        <Slider
          onChange={onChange}
          min={min}
          max={max}
          value={value}
          step={step}
          railStyle={tw`bg-primary-400 height[3px]`}
          trackStyle={tw`bg-primary-400 height[3px]`}
          handleStyle={tw`bg-secondary border-0 shadow-none`}
          dotStyle={tw`bg-secondary border-0 height[3px] width[3px] marginBottom[3px]`}
          // activeDotStyle={tw`bg-secondary border-0 height[7px] width[7px] marginBottom[1px]`}
          marks={marks}
        />
      </span>
    </div>
  );
};

export default SliderBar;
