import {
  Slider as ChakraSlider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  UseSliderProps,
} from "@chakra-ui/react";

interface Props {
  value: number;
  onChange: UseSliderProps["onChange"];
}

const Slider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <ChakraSlider
      value={value}
      onChange={onChange}
      aria-label="slider-ex-4"
      defaultValue={30}
      min={1}
      max={12}
      step={1}
    >
      <SliderTrack bg="white">
        <SliderFilledTrack bg="transparent" />
      </SliderTrack>
      <SliderThumb boxSize={5} />
    </ChakraSlider>
  );
};

export default Slider;
