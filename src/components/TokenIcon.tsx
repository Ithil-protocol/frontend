import { FC } from "react";

import { getTokenIcon } from "@/utils";

interface TokenIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const TokenIcon: FC<TokenIconProps> = ({ name, ...props }) => {
  const Icon = getTokenIcon(name);

  return <Icon {...props} />;
};

export default TokenIcon;
