import { GridItem, SliderProps, VStack } from "@chakra-ui/react";

import IthilDark from "@/assets/ithil/logoSymbolDark.svg";
import IthilLight from "@/assets/ithil/logoSymbolLight.svg";
import Slider from "@/components/Slider";
import TokenIcon from "@/components/TokenIcon";
import ServiceIcon from "@/containers/Service/ServiceIcon";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";
import { PositionData } from "@/types";

import PositionsDetailItem from "./PositionsDetailItem";

interface Props {
  canShowPercentageSlider?: boolean;
  canShowSlippageSlider?: boolean;
  data: PositionData;
  onPurchasePriceChange?: SliderProps["onChange"];
  onSlippageChange?: SliderProps["onChange"];
}

const PositionsDetails: React.FC<Props> = ({
  canShowPercentageSlider,
  canShowSlippageSlider,
  data,
  onPurchasePriceChange,
  onSlippageChange,
}) => {
  const { pickColor, colorMode } = useColorMode();

  const isDebitService = data.position === "aave" || data.position === "gmx";

  const ITHILObtainedIcon = colorMode === "dark" ? IthilDark : IthilLight;

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
              postfix={data.assetLabel?.toUpperCase()}
              postfixIcon={
                data.assetName && (
                  <TokenIcon name={data.assetName} width={20} height={20} />
                )
              }
            />
          )}

          {data.amountObtained && (
            <PositionsDetailItem
              title="Amount Obtained"
              value={data.amountObtained}
              postfix={data.assetLabel?.toUpperCase()}
              postfixIcon={
                data.assetName && (
                  <TokenIcon name={data.assetName} width={20} height={20} />
                )
              }
            />
          )}

          {data.percentage && (
            <PositionsDetailItem
              // postfixIcon={<TokenIcon name="WETH" width={20} height={20} />}
              postfix="%"
              title="ITHIL Percentage"
              value={data.percentage}
            />
          )}

          {data.notionalPercentage && (
            <PositionsDetailItem
              // postfixIcon={<TokenIcon name="WETH" width={20} height={20} />}
              postfix="%"
              title="Notional Percentage"
              value={data.notionalPercentage}
            />
          )}

          {data.position === "call-option" && data.type === "close" && (
            <>
              <PositionsDetailItem
                title="Purchase Price"
                prefix="$"
                value={data.purchasePrice || "0"}
              />
            </>
          )}

          {canShowPercentageSlider && (
            <div
              style={{
                padding: "10px 5px 15px",
                width: "100%",
              }}
            >
              <Slider
                value={Number(data.percentage) || 0}
                max={100}
                min={0}
                onChange={onPurchasePriceChange}
                extension="%"
              />
            </div>
          )}

          {data.margin && (
            <PositionsDetailItem
              title="Margin"
              value={data.margin}
              postfix={data.assetLabel?.toUpperCase()}
              postfixIcon={
                data.assetName && (
                  <TokenIcon name={data.assetName} width={20} height={20} />
                )
              }
            />
          )}

          {data.wethReward && (
            <PositionsDetailItem
              postfixIcon={<TokenIcon name="WETH" width={20} height={20} />}
              title="Weth Reward"
              value={data.wethReward}
            />
          )}

          {data.collateral && (
            <PositionsDetailItem
              title="Collateral"
              value={data.collateral}
              postfix={data.assetLabel?.toUpperCase()}
              postfixIcon={
                data.assetName && (
                  <TokenIcon name={data.assetName} width={20} height={20} />
                )
              }
            />
          )}

          {data.aCollateral && (
            <PositionsDetailItem
              title="Collateral"
              value={data.aCollateral}
              postfix={`a${data.assetLabel?.toUpperCase()}`}
              postfixIcon={
                <ServiceIcon name={data.position!} width={20} height={20} />
              }
            />
          )}

          {data.gmxCollateral && (
            <PositionsDetailItem
              title="Collateral"
              value={data.gmxCollateral}
              postfix="GLP"
              postfixIcon={
                <ServiceIcon name={data.position!} width={30} height={20} />
              }
            />
          )}

          {data.ithilObtained && (
            <PositionsDetailItem
              title="Obtained"
              value={data.ithilObtained}
              postfix="ITHIL"
              postfixIcon={<ITHILObtainedIcon width={20} height={20} />}
            />
          )}

          {data.redeemPrice && (
            <PositionsDetailItem
              title="Redeem price"
              value={data.redeemPrice}
              prefix="$"
            />
          )}

          {data.maturityDate && (
            <PositionsDetailItem
              title="Maturity date"
              value={data.maturityDate}
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
        </VStack>
      </VStack>
    </GridItem>
  );
};

export default PositionsDetails;
