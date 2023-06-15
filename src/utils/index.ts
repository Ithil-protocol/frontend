import Generic from "cryptocurrency-icons/svg/icon/generic.svg";

import { icons } from "@/config/icons";

export const getTokenIcon = (key: string) => {
  const icon = icons[key.toUpperCase() as keyof typeof icons];
  return icon || Generic;
};
