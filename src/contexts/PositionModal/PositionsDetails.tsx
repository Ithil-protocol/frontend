import { GridItem, SliderProps, VStack } from "@chakra-ui/react";

import Slider from "@/components/Slider";
import TokenIcon from "@/components/TokenIcon";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

import PositionsDetailItem from "./PositionsDetailItem";
import { Data } from "./types";

interface Props {
  data: Data;
  lockTimeText?: string;
  canShowSlippageSlider?: boolean;
  canShowPercentageSlider?: boolean;
  onPurchasePriceChange?: SliderProps["onChange"];
  onSlippageChange?: SliderProps["onChange"];
}

const PositionsDetails: React.FC<Props> = ({
  canShowPercentageSlider,
  canShowSlippageSlider,
  data,
  lockTimeText,
  onPurchasePriceChange,
  onSlippageChange,
}) => {
  const { pickColor } = useColorMode();

  const isDebitService = data.position === "aave" || data.position === "gmx";

  const { slippage = "0" } = data;
  return (
    <GridItem
      borderRadius={["12px"]}
      paddingX={{
        base: "20px",
        lg: "40px",
        md: "30px",
      }}
      paddingY={{
        base: "20px",
        lg: "40px",
        md: "30px",
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
          {data.position === "call-option" && data.type === "close" && (
            <>
              <PositionsDetailItem
                title="Purchase Price"
                prefix="$"
                value={data.purchasePrice || "0"}
              />
              <div
                style={{
                  padding: "10px 5px",
                  width: "100%",
                }}
              >
                {canShowPercentageSlider && (
                  <Slider
                    value={data.percentage || 0}
                    max={100}
                    min={0}
                    onChange={onPurchasePriceChange}
                    extension="%"
                  />
                )}
              </div>
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
          {isDebitService && (
            <PositionsDetailItem
              title="Leverage"
              postfix="x"
              value={data.leverage || "0"}
            />
          )}
          {isDebitService && (
            <>
              <PositionsDetailItem
                title="Slippage"
                postfix="%"
                value={data.slippage || "0"}
              />
              {canShowSlippageSlider && (
                <div style={{ padding: "10px 5px", width: "100%" }}>
                  <Slider
                    value={+slippage}
                    max={10}
                    min={1}
                    onChange={onSlippageChange}
                    extension="%"
                  />
                </div>
              )}
            </>
          )}
          {data.lockTime && lockTimeText && (
            <PositionsDetailItem title={lockTimeText} value={data.lockTime} />
          )}
        </VStack>
      </VStack>
    </GridItem>
  );
};

export default PositionsDetails;
