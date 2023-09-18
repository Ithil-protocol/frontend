import { AddIcon } from "@chakra-ui/icons";
import { Button, Td, Text, Tr } from "@chakra-ui/react";
import classNames from "classnames";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";

import TokenIcon from "@/components/TokenIcon";
import { Loading } from "@/components/loading";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Vaults } from "@/types";
import { cutoffDecimals } from "@/utils";
import { addTokenToWallet } from "@/utils/addTokenToWallet";

import TRowItem from "./TRowItem";

interface Props {
  isLoading: boolean;
  vaultData: Vaults | undefined;
  setSelectedRow: Dispatch<SetStateAction<null | number>>;
  selectedRow: null | number;
  idx: number;
  vault: Vaults[number];
  isVaultsError: boolean;
}

const TRow: FC<Props> = ({
  isLoading,
  vaultData,
  setSelectedRow,
  selectedRow,
  idx,
  vault,
  isVaultsError,
}) => {
  const isVaultsLoading = isLoading;

  const isMounted = useIsMounted();
  const onSelectedChange = (idx: number) => {
    // not sure this check is necessary
    const vault = vaultData?.[idx];
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
          <Text>{vault.token.label}</Text>
        </div>
      </Td>
      <Td width="15%">
        {isLoading || !isMounted ? (
          <Loading />
        ) : (
          cutoffDecimals(Number(vault.apy || 0), 2) + "%"
        )}
      </Td>
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
      <Td>
        <Button
          variant="solid"
          w={10}
          h={10}
          borderRadius={10000}
          onClick={(e) => {
            e.stopPropagation();
            addTokenToWallet({
              ...vault.token,
              tokenAddress: vault.token.iTokenAddress,
            });
          }}
        >
          <AddIcon />
        </Button>
      </Td>
    </Tr>
  );
};

export default TRow;
