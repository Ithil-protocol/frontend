import { FC } from "react";

import { getTokenIcon } from "@/utils";

interface TokenIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const TokenIcon: FC<TokenIconProps> = ({
  name,
  height = 32,
  width = 32,
  ...props
}) => {
  const Icon = getTokenIcon(name);

  return <Icon {...props} height={height} width={width} />;
};

export default TokenIcon;
