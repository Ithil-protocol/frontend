import { Button } from "@chakra-ui/react";
import { FC } from "react";

interface TabSwitchProps {
  values: Array<{ title: string; value: string }>;
  onChange: (value: string) => void;
}

const TabSwitch: FC<TabSwitchProps> = ({ values, onChange }) => (
  <div className="flex flex-row gap-4">
    {values.map(({ title, value }) => (
      <Button key={value} onClick={() => onChange(value)} variant="outline">
        {title}
      </Button>
    ))}
  </div>
);

export default TabSwitch;
