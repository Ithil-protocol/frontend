import { useColorMode } from "@chakra-ui/react";
import { FC } from "react";

import IthilDark from "@/assets/ithil/logoSymbolDark.svg";
import IthilLight from "@/assets/ithil/logoSymbolLight.svg";
import { Aave, AgEur, Frax, Gmx } from "@/assets/svgs";
import { ServiceName } from "@/types";

interface Props {
  name: ServiceName;
  width?: number | string;
  height?: number | string;
}

const ServiceIcon: FC<Props> = ({ name, width = 28, height = 28 }) => {
  const { colorMode } = useColorMode();
  const icons: Partial<{ [key in ServiceName]: any }> = {
    aave: Aave,
    gmx: Gmx,
    fraxlend: Frax,
    angle: AgEur,
  };
  const Ithil = colorMode === "dark" ? IthilDark : IthilLight;
  const Icon = icons[name] || Ithil;
  return <Icon width={width} height={height} />;
};

export default ServiceIcon;
