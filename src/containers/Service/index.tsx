import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  SkeletonText,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { type FC } from "react";
import { type Address } from "wagmi";

import Aave from "@/assets/svgs/aave.svg";
import { firstNetwork } from "@/config/chains";
import { useBaseApy } from "@/hooks/useBaseApy";
import { palette } from "@/styles/theme/palette";
import { type PropsWithClassName } from "@/types/components.types";
import { type AaveAsset, type AaveService } from "@/types/onchain.types";
import { pickColor } from "@/utils/theme";

import { Graph } from "./graph";
import { ServiceDeposit } from "./single-asset-deposit";

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
  const { colorMode } = useColorMode();
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
                color={pickColor(colorMode, palette.variants.primary, "action")}
              ></Icon>
              <Heading size="h2">Address on explorer</Heading>
            </a>
          )}
        </div>

        <Text textStyle="sm">{description}</Text>

        <div className="flex flex-col gap-2 p-5 rounded-xl bg-primary-200">
          <Heading size="h4">APY Breakdown</Heading>
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row items-baseline flex-grow gap-4">
              <Heading
                size="h5"
                color={pickColor(colorMode, palette.colors.primary, "800")}
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

            <div className="flex flex-row items-baseline justify-center flex-grow gap-4 border-l border-secondary-500">
              <Heading
                size="h5"
                color={pickColor(colorMode, palette.colors.primary, "800")}
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

            <div className="flex flex-row items-baseline justify-center flex-grow gap-4 border-l border-secondary-500">
              <Heading
                size="h5"
                color={pickColor(colorMode, palette.colors.primary, "800")}
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
          </div>
        </div>
      </div>
    </div>
  );
};

enum SafetyScoreValue {
  positive = "positive",
  neutral = "neutral",
  negative = "negative",
}

interface SafetyScoreProps extends PropsWithClassName {
  score: number;
  features: Array<{
    value: SafetyScoreValue;
    text: string;
    extendedDescription?: string;
  }>;
  description?: string;
}

const SafetyScore: FC<SafetyScoreProps> = ({
  score,
  features,
  description,
}) => {
  const { colorMode } = useColorMode();

  const safetyScoreToIcon: Record<SafetyScoreValue, string> = {
    [SafetyScoreValue.positive]: "tabler:arrow-badge-up",
    [SafetyScoreValue.neutral]: "codicon:dash",
    [SafetyScoreValue.negative]: "tabler:arrow-badge-down",
  };

  const safetyScoreToColor: Record<SafetyScoreValue, string> = {
    [SafetyScoreValue.positive]: pickColor(colorMode, palette.safety, "green"),
    [SafetyScoreValue.neutral]: pickColor(colorMode, palette.safety, "neutral"),
    [SafetyScoreValue.negative]: pickColor(colorMode, palette.safety, "red"),
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl bg-primary-100">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Heading size="h3">Safety Score High</Heading>
          <Text
            textStyle="slender-md"
            fontWeight={700}
            color={pickColor(colorMode, palette.safety, "green")}
          >
            {score}
          </Text>
          {score > 9 && (
            <Icon
              icon="ph:crown-duotone"
              width="28px"
              height="28px"
              color={pickColor(colorMode, palette.safety, "green")}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {features.map(({ value, text, extendedDescription }) => (
          <div className="flex flex-row items-center gap-2" key={text}>
            <Icon
              icon={safetyScoreToIcon[value]}
              width="20px"
              height="20px"
              color={safetyScoreToColor[value]}
            />
            <Text textStyle="md">{text}</Text>
            {extendedDescription != null && (
              <Tooltip label={extendedDescription} closeDelay={500}>
                <Icon
                  icon="tabler:exclamation-circle"
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      {description != null && (
        <div className="p-2 rounded-md cursor-pointer bg-primary-200">
          <Accordion className="w-full" allowToggle>
            <AccordionItem className="border-0">
              <AccordionButton className="flex flex-row justify-between">
                <Text textStyle="md" fontWeight={500}>
                  Details
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Text textStyle="sm">{description}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

interface Props {
  service: AaveService;
  asset: AaveAsset;
}

const ServicePage: FC<Props> = ({ service, asset }) => {
  const {
    query: { asset: token },
  } = useRouter();

  const boostApy = 1;
  const { baseApy, isLoading } = useBaseApy(token as string);

  const name = "Aave leveraged lending";
  const description =
    "Optimize your capital allocation for max returns in one of the biggest and most secure over collateralized lending markets in DeFi";

  const features: SafetyScoreProps["features"] = [
    { value: SafetyScoreValue.positive, text: "Battle-tested strategy" },
    { value: SafetyScoreValue.positive, text: "Low volatility assets" },
    {
      value: SafetyScoreValue.positive,
      text: "DeFi blue chip",
      extendedDescription:
        "Assets with Market Cap between 1M and 10M fall in this category",
    },
    {
      value: SafetyScoreValue.neutral,
      text: "Average returns",
      extendedDescription:
        "Impermanent Loss is a potential loss of value experienced by liquidity providers when the price of an asset in a liquidity pool diverges from its price in external markets.",
    },
  ];

  const safetyScoreDescription = `By depositing your tokens on Aave, you contribute to a robust lending pool that serves borrowers across multiple chains, making it one of the most trusted and established DeFi protocols in the industry.
Aave operates as a decentralized lending and borrowing platform, facilitating the lending of tokens by depositors and providing borrowers with access to these tokens. As a depositor, you earn a fee in return for lending your tokens to borrowers on the platform. This fee, which is derived from the interest paid by borrowers, serves as a source of income for you, boosting your overall APY.
Aave's reputation for security and reliability is built on its extensive track record and adoption across various blockchain networks. With billions of dollars secured across more than five chains, Aave has consistently demonstrated its ability to safeguard user funds and maintain the integrity of its lending platform.`;
  return (
    <>
      <Head>
        <title>Ithil - Services</title>
        <meta
          name="description"
          content="Official frontend for Ithil strategies"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid w-full grid-cols-10 gap-6">
        <div className="flex flex-col flex-grow gap-6 col-span-full lg:col-span-7">
          {/* Strategy Introduction */}
          <div className="flex flex-row gap-2 p-5 rounded-xl bg-primary-100">
            <div className="flex flex-col w-full gap-3">
              <div className="flex flex-row justify-between">
                <Heading size="h1b" lineHeight="32px">
                  {name}
                </Heading>
                <Aave width={40} height={40} />
              </div>
              <Text textStyle="sm">{description}</Text>
            </div>
          </div>

          <Graph />

          <StrategyDescription
            description="This service simply deposits tokens in the Aave V3 protocol and earns a stable APY through the protocol itself."
            address={service.address}
            baseApy={baseApy}
            boostApy={boostApy}
            isLoading={isLoading}
          />

          <SafetyScore
            score={9.3}
            features={features}
            description={safetyScoreDescription}
          />
        </div>
        <div className="flex-shrink-0 col-span-full lg:col-span-3">
          <ServiceDeposit asset={asset} />
        </div>
      </div>
    </>
  );
};

export default ServicePage;
