import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import TokenIcon from "@/components/TokenIcon";
import { Loading } from "@/components/loading";
import { useTokenModal } from "@/contexts/TokenModal";
import { getDecimalRegex } from "@/data/regex";
import { useServiceName } from "@/hooks/useServiceName";
import { Asset, ServiceName } from "@/types";
import { convertNamesToAssets, getServiceByName } from "@/utils";

interface Props {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  asset: Pick<Asset, "name" | "decimals" | "label">;
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
  const serviceName = useServiceName();

  const tokenModal = useTokenModal({
    onSelectTokenCallback: () => {
      onChange("");
    },
  });

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!asset?.decimals) return;
    if (getDecimalRegex(asset?.decimals).test(value) || value === "") {
      onChange(value);
    }
  };
  const router = useRouter();
  // const { data: vaultData } = useVaults();
  const tokens =
    getServiceByName(router.pathname.split("/")[2] as ServiceName)?.tokens ||
    [];
  const filteredAsset = convertNamesToAssets(tokens);
  return (
    <>
      <div className="flex gap-2">
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() =>
            switchableAsset &&
            serviceName &&
            tokenModal.openDialog(filteredAsset, serviceName)
          }
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
              <Text textStyle="sm">{asset?.label}</Text>
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
    </>
  );
};

export default SingleAssetAmount;
