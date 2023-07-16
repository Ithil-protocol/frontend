import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import TokenIcon from "@/components/TokenIcon";
import TokenModal from "@/components/TokenModal";
import { Loading } from "@/components/loading";
import { getDecimalRegex } from "@/data/regex";
import { AaveAsset } from "@/types/onchain.types";

interface Props {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  asset: AaveAsset;
  onMaxClick: () => void;
  isMaxDisabled: boolean;
  switchableAsset?: boolean;
}

const SingleAssetAmount: FC<Props> = ({
  value,
  onChange,
  asset,
  onMaxClick,
  isMaxDisabled,
  switchableAsset = true,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!asset?.decimals) return;
    if (getDecimalRegex(asset?.decimals).test(value) || value === "") {
      onChange(value);
    }
  };

  const onSelectToken = () => {
    onChange("0");
    onClose();
  };

  return (
    <>
      <div className="flex gap-2">
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={switchableAsset ? onOpen : undefined}
          className="flex items-center gap-1 justify-center px-2 rounded-md bg-primary-200 min-w-[92px]"
        >
          {asset === null ? (
            <Loading />
          ) : (
            <div
              style={{
                display: "flex",
                gap: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span>
                <TokenIcon
                  className="w-6 h-6"
                  name={asset?.name}
                  height={24}
                  width={24}
                />
              </span>
              <Text textStyle="sm">{asset?.name}</Text>
            </div>
          )}
        </div>

        <InputGroup size="md">
          <Input
            type="number"
            step="0.1"
            variant="filled"
            value={value}
            onChange={onInputChange}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={onMaxClick}
              isDisabled={isMaxDisabled}
              variant="insideInput"
            >
              Max
            </Button>
          </InputRightElement>
        </InputGroup>
      </div>
      <TokenModal
        onSelectToken={onSelectToken}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default SingleAssetAmount;
