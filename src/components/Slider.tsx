import {
  Slider as ChakraSlider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  UseSliderProps,
} from "@chakra-ui/react";

interface Props {
  value: number;
  onChange: UseSliderProps["onChange"];
}

const Slider: React.FC<Props> = ({ value, onChange }) => {
  const numberBarItems = [];

  for (let index = 1; index <= 12; index += 1) {
    numberBarItems.push(
      <SliderMark
        style={{
          borderRadius: "25%",
          backgroundColor: index === value ? "#077CE0" : "cyan",
          padding: "2px 10px",
        }}
        key={index}
        mt={"20px"}
        value={index}
        fontSize="18px"
        color={index === value ? "white" : "black"}
      >
        <span style={{}}>{index}</span>
      </SliderMark>
    );
  }

  return (
    <>
      <ChakraSlider
        value={value}
        onChange={onChange}
        aria-label="slider-ex-4"
        defaultValue={value}
        min={1}
        max={12}
        step={1}
        style={{ width: "100%" }}
      >
        {numberBarItems}
        <SliderTrack bg="white">
          <SliderFilledTrack bg="transparent" />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </ChakraSlider>
    </>
  );
};

export default Slider;
