import { FC } from "react";

import { Aave } from "@/assets/svgs";
import { ServiceType } from "@/types";

interface Props {
  name: ServiceType;
  width?: number;
  height?: number;
}

const ServiceIcon: FC<Props> = ({ name, width = 28, height = 28 }) => {
  // const icons = {
  //   AAVE: Aave,
  //   GMX: Gmx,
  // };

  // const Icon = icons[name];
  // return <Icon />;

  switch (name) {
    case "AAVE":
      return <Aave width={width} height={height} />;
  }
};

export default ServiceIcon;
