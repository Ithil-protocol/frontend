import { Text, Tooltip } from "@chakra-ui/react";

import { Tooltip as TooltipIcon } from "@/assets/svgs";

interface Props {
  label: string;
  tooltip?: string;
}

const AdvancedFormLabel: React.FC<Props> = ({ label, tooltip }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {tooltip ? (
          <Tooltip label={tooltip} closeDelay={500}>
            <Text>
              {label}{" "}
              <TooltipIcon
                width={20}
                height={20}
                style={{
                  display: "inline",
                  cursor: "help",
                }}
              />
            </Text>
          </Tooltip>
        ) : (
          <Text>{label}</Text>
        )}
      </div>
    </>
  );
};

export default AdvancedFormLabel;
