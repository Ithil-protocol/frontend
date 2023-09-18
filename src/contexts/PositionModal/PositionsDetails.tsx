import { GridItem, SliderProps, VStack } from "@chakra-ui/react";

import Slider from "@/components/Slider";
import TokenIcon from "@/components/TokenIcon";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

import PositionsDetailItem from "./PositionsDetailItem";
import { Data } from "./types";

interface Props {
  data: Data;
  lockTimeText: string;
  onPurchasePriceChange?: SliderProps["onChange"];
  onSlippageChange?: SliderProps["onChange"];
  percentage?: number;
  slippage?: number;
}

const PositionsDetails: React.FC<Props> = ({
  data,
  lockTimeText,
  onPurchasePriceChange,
  onSlippageChange,
  percentage,
  slippage,
}) => {
  const { pickColor } = useColorMode();

  return (
    <GridItem
      borderRadius={["12px"]}
      paddingX={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      paddingY={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      bg={pickColor(palette.colors.primary, "100")}
    >
      <VStack alignItems="start" spacing="40px" height="full">
        <VStack spacing="24px" width="full">
          {data.position && (
            <PositionsDetailItem
              title="Position"
              value={data.position.toUpperCase()}
            />
          )}
          {data.amount && (
            <PositionsDetailItem
              title="Amount"
              value={data.amount}
              postfix={data.token.toUpperCase()}
              postfixIcon={
                <TokenIcon name={data.token} width={20} height={20} />
              }
            />
          )}
          {data.amountObtained && (
            <PositionsDetailItem
              title="Amount Obtained"
              value={data.amountObtained}
              postfix={data.token.toUpperCase()}
              postfixIcon={
                <TokenIcon name={data.token} width={20} height={20} />
              }
            />
          )}
          {data.wethReward && (
            <PositionsDetailItem title="Weth Reward" value={data.wethReward} />
          )}
          {data.purchasePrice && typeof percentage === "number" && (
            <>
              <PositionsDetailItem
                title="Purchase price"
                prefix="$"
                value={data.purchasePrice}
              />
              <Slider
                value={percentage}
                max={100}
                min={0}
                onChange={onPurchasePriceChange}
                extension="%"
              />
            </>
          )}
          {data.collateral && (
            <PositionsDetailItem
              title="Collateral"
              value={data.collateral}
              postfix={data.token.toUpperCase()}
              postfixIcon={
                <TokenIcon name={data.token} width={20} height={20} />
              }
            />
          )}
          {data.pnlPercentage && data.formattedPnl && (
            <PositionsDetailItem
              title="PNL"
              value=""
              postfix={`${data.pnlPercentage} %`}
              prefix={data.formattedPnl}
              postfixStyle={{
                backgroundColor: data.pnlColor,
                color: pickColor(palette.colors.primary, "100"),
                padding: "4px 8px",
                borderRadius: "8px",
              }}
              prefixStyle={{ color: data.pnlColor }}
            />
          )}
          {data.leverage && (
            <PositionsDetailItem
              title="Leverage"
              postfix="x"
              value={data.leverage}
            />
          )}
          {data.slippage && typeof slippage === "number" && (
            <>
              <PositionsDetailItem
                title="Slippage"
                postfix="%"
                value={data.slippage}
              />
              <div style={{ padding: "10px 5px", width: "100%" }}>
                <Slider
                  value={slippage}
                  max={10}
                  min={1}
                  onChange={onSlippageChange}
                  extension="%"
                />
              </div>
            </>
          )}
          {data.lockTime && (
            <PositionsDetailItem title={lockTimeText} value={data.lockTime} />
          )}
        </VStack>
      </VStack>
    </GridItem>
  );
};

export default PositionsDetails;
