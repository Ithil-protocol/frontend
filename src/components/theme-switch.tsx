import { useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import { type FC } from "react";
import Switch from "react-switch";

import { type PropsWithClassName } from "@/types/components.types";

export const ThemeSwitch: FC<PropsWithClassName> = ({ className }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Switch
      className={className}
      onChange={toggleColorMode}
      uncheckedIcon={
        <div className="flex justify-center items-center [height:100%]">
          <Image
            src={"/assets/ithil/switchDark.svg"}
            alt="Switch dark mode"
            height={16}
            width={16}
          />
        </div>
      }
      checkedIcon={
        <div className="flex justify-center items-center [height:100%]">
          <Image
            src={"/assets/ithil/switchLight.svg"}
            alt="Switch light mode"
            height={16}
            width={16}
          />
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
