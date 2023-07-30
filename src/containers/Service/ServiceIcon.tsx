import { FC } from "react";

import Ithil from "@/assets/ithil/logoSymbolLight.svg";
import { Aave, Gmx } from "@/assets/svgs";
import { ServiceName } from "@/types";

interface Props {
  name: ServiceName;
  width?: number | string;
  height?: number | string;
}

const ServiceIcon: FC<Props> = ({ name, width = 28, height = 28 }) => {
  const icons: Partial<{ [key in ServiceName]: any }> = {
    aave: Aave,
    gmx: Gmx,
  };

  const Icon = icons[name] || Ithil;
  return <Icon width={width} height={height} />;
};

export default ServiceIcon;
