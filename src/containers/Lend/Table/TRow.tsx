import { Button, Td, Text, Tr } from "@chakra-ui/react";
import classNames from "classnames";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";

import TokenIcon from "@/components/TokenIcon";
import { LendingToken, Vaults } from "@/types/onchain.types";

import TRowItem from "./TRowItem";

interface Props {
  isLoadingError: boolean;
  isLoading: boolean;
  vaultData: Vaults | undefined;
  vaultDataWithFallback: { key: string; token: LendingToken }[];
  setSelectedRow: Dispatch<SetStateAction<null | number>>;
  selectedRow: null | number;
  idx: number;
  vault: Vaults[number];
  isVaultsError: boolean;
}

const TRow: FC<Props> = ({
  isLoading,
  isLoadingError,
  vaultData,
  vaultDataWithFallback,
  setSelectedRow,
  selectedRow,
  idx,
  vault,
  isVaultsError,
}) => {
  const isVaultsLoading = isLoading || isLoadingError;

  console.log("vaultData33", vaultData);

  const onSelectedChange = (idx: number) => {
    // not sure this check is necessary
    const vault = vaultDataWithFallback?.[idx];
    if (vault == null) return;
    // clicking on selected row will unselect it
    if (selectedRow === idx) return setSelectedRow(null);
    return setSelectedRow(idx);
  };
  return (
    <Tr
      onClick={() => onSelectedChange(idx)}
      className={classNames([
        "cursor-pointer",
        "hover:bg-primary-200",
        selectedRow === idx && "border-none bg-primary-200",
      ])}
    >
      <Td width="15%">
        <div className="flex items-center gap-2">
          <TokenIcon name={vault.token.name} height={32} width={32} />
          <Text className="uppercase">{vault.token.name}</Text>
        </div>
      </Td>
      <Td width="15%">5%</Td>
      <TRowItem
        width="20%"
        isVaultsError={isVaultsError}
        isVaultsLoading={isVaultsLoading}
        value={vault.tvl}
        token={vault.token}
      />
      <TRowItem
        width="20%"
        isVaultsError={isVaultsError}
        isVaultsLoading={isVaultsLoading}
        value={vault.borrowed}
        token={vault.token}
      />
      <TRowItem
        width="15%"
        isVaultsError={isVaultsError}
        isVaultsLoading={isVaultsLoading}
        value={vault.deposited}
        token={vault.token}
      />
      <Td>
        <Link
          onClick={(e) => {
            e.stopPropagation();
          }}
          href={`/lend/details/${vault.token.name.toLowerCase()}`}
        >
          <Button
            fontSize="sm"
            fontWeight="normal"
            style={{
              borderRadius: "10px",
              padding: "0px 10px",
            }}
            variant="outline"
          >
            Info
          </Button>
        </Link>
      </Td>
    </Tr>
  );
};

export default TRow;
