import { useColorMode } from "@chakra-ui/react";
import { type FC } from "react";
import Switch from "react-switch";

import SwitchDark from "@/assets/ithil/switchDark.svg";
import SwitchLight from "@/assets/ithil/switchLight.svg";
import { type PropsWithClassName } from "@/types/components.types";

export const ThemeSwitch: FC<PropsWithClassName> = ({ className }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Switch
      className={className}
      onChange={toggleColorMode}
      uncheckedIcon={
        <div className="flex justify-center items-center [height:100%]">
          <SwitchDark width={16} />
        </div>
      }
      checkedIcon={
        <div className="flex justify-center items-center [height:100%]">
          <SwitchLight width={16} />
        </div>
      }
      checked={colorMode === "light"}
      onColor="#F2F5F6"
      offColor="#20293A"
      onHandleColor="#FB8E51"
      offHandleColor="#F3E7A8"
    />
  );
};
