import { Heading, SkeletonText, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { FC } from "react";
import { type Address } from "wagmi";

import { firstNetwork } from "@/config/chains";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";
import { PropsWithClassName } from "@/types/components.types";

interface StrategyDescriptionProps extends PropsWithClassName {
  description: string;
  address: Address;
  baseApy?: number;
  boostApy?: number;
  isLoading?: boolean;
}

const StrategyDescription: FC<StrategyDescriptionProps> = ({
  description,
  address,
  baseApy,
  boostApy,
  isLoading = false,
  className,
}) => {
  const { pickColor } = useColorMode();
  const network = firstNetwork();
  const explorerBaseUrl = network.blockExplorers?.default.url;
  const containerClasses = "p-5 rounded-xl bg-primary-100";

  const totalApy = baseApy && boostApy ? baseApy + boostApy : 0;

  return (
    <div className={classNames(containerClasses, className)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <Heading size="h3">Service</Heading>
          {explorerBaseUrl != null && (
            <a
              href={`${explorerBaseUrl}/address/${address}`}
              target="_blank"
              className="flex flex-row items-center gap-2"
            >
              <Icon
                icon="mdi:link"
                width="20px"
                height="20px"
                color={pickColor(palette.variants.primary, "action")}
              ></Icon>
              <Heading size="h2">Address on explorer</Heading>
            </a>
          )}
        </div>

        <Text textStyle="sm">{description}</Text>

        <div className="flex flex-col gap-2 p-5 rounded-xl bg-primary-200">
          <Heading size="h4">APY Breakdown</Heading>
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row items-baseline justify-center flex-grow gap-4">
              <Heading
                size="h5"
                color={pickColor(palette.colors.primary, "800")}
                textTransform="uppercase"
              >
                Base APY
              </Heading>
              {isLoading ? (
                <SkeletonText width={30} noOfLines={1} />
              ) : (
                <Text textStyle="slender-sm2">{baseApy?.toFixed(2)} %</Text>
              )}
            </div>

            {boostApy && (
              <div className="flex flex-row items-baseline justify-center flex-grow gap-4 border-l border-secondary-500">
                <Heading
                  size="h5"
                  color={pickColor(palette.colors.primary, "800")}
                  textTransform="uppercase"
                >
                  Boost APY
                </Heading>
                {isLoading ? (
                  <SkeletonText width={30} noOfLines={1} />
                ) : (
                  <Text textStyle="slender-sm2">{boostApy?.toFixed(2)} %</Text>
                )}
              </div>
            )}

            {boostApy && (
              <div className="flex flex-row items-baseline justify-center flex-grow gap-4 border-l border-secondary-500">
                <Heading
                  size="h5"
                  color={pickColor(palette.colors.primary, "800")}
                  textTransform="uppercase"
                >
                  Total APY
                </Heading>
                {isLoading ? (
                  <SkeletonText width={30} noOfLines={1} />
                ) : (
                  <Text textStyle="slender-sm2">{totalApy?.toFixed(2)} %</Text>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StrategyDescription;
