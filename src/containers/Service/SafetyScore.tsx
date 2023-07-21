import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { FC } from "react";

import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";
import { PropsWithClassName } from "@/types/components.types";
import { SafetyScoreValue } from "@/utils";

interface SafetyScoreProps extends PropsWithClassName {
  score: number;
  features: Array<{
    value: SafetyScoreValue;
    text: string;
    extendedDescription?: string;
  }>;
  description?: string;
}

const SafetyScore: FC<SafetyScoreProps> = ({
  score,
  features,
  description,
}) => {
  const { pickColor } = useColorMode();

  const safetyScoreToIcon: Record<SafetyScoreValue, string> = {
    [SafetyScoreValue.positive]: "tabler:arrow-badge-up",
    [SafetyScoreValue.neutral]: "codicon:dash",
    [SafetyScoreValue.negative]: "tabler:arrow-badge-down",
  };

  const safetyScoreToColor: Record<SafetyScoreValue, string> = {
    [SafetyScoreValue.positive]: pickColor(palette.safety, "green"),
    [SafetyScoreValue.neutral]: pickColor(palette.safety, "neutral"),
    [SafetyScoreValue.negative]: pickColor(palette.safety, "red"),
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl bg-primary-100">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Heading size="h3">Safety Score High</Heading>
          <Text
            textStyle="slender-md"
            fontWeight={700}
            color={pickColor(palette.safety, "green")}
          >
            {score.toFixed(1)}
          </Text>
          {score > 9 && (
            <Icon
              icon="ph:crown-duotone"
              width="28px"
              height="28px"
              color={pickColor(palette.safety, "green")}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {features.map(({ value, text, extendedDescription }) => (
          <div className="flex flex-row items-center gap-2" key={text}>
            <Icon
              icon={safetyScoreToIcon[value]}
              width="20px"
              height="20px"
              color={safetyScoreToColor[value]}
            />
            <Text textStyle="md">{text}</Text>
            {extendedDescription != null && (
              <Tooltip label={extendedDescription} closeDelay={500}>
                <Icon
                  icon="tabler:exclamation-circle"
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      {description != null && (
        <div className="p-2 rounded-md cursor-pointer bg-primary-200">
          <Accordion className="w-full" allowToggle>
            <AccordionItem className="border-0">
              <AccordionButton className="flex flex-row justify-between">
                <Text textStyle="md" fontWeight={500}>
                  Details
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Text textStyle="sm">{description}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default SafetyScore;
