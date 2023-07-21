import { FC } from "react";

import { Aave, Gmx } from "@/assets/svgs";
import { ServiceType } from "@/types";

interface Props {
  name: ServiceType;
  width?: number | string;
  height?: number | string;
}

const ServiceIcon: FC<Props> = ({ name, width = 28, height = 28 }) => {
  const icons = {
    AAVE: Aave,
    GMX: Gmx,
  };

  const Icon = icons[name] || icons.AAVE;
  return <Icon width={width} height={height} />;
};

export default ServiceIcon;
