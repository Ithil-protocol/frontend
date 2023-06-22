import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { type FC, Fragment, useState } from "react";

import ToolTipIcon from "@/assets/svgs/Tooltip.svg";
import TokenIcon from "@/components/TokenIcon";
import { DynamicEstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import PageWrapper from "@/components/page-wrapper";
import { lendContent } from "@/content/lend";
import { placeHolderVaultData, useVaults } from "@/hooks/use-vaults.hook";
import { type Vaults } from "@/types/onchain.types";

import { Deposit } from "./deposit";

const mobileHiddenColumnClass = "hidden md:table-cell";

const Lend: FC = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const {
    data: vaultData,
    isError: isVaultsError,
    isLoading,
    isLoadingError,
  } = useVaults();
  // computed values
  const vaultDataWithFallback = vaultData ?? placeHolderVaultData;
  const isVaultsLoading = isLoading || isLoadingError;

  const onSelectedChange = (idx: number) => {
    // not sure this check is necessary
    const vault = vaultDataWithFallback?.[idx];
    if (vault == null) return;
    // clicking on selected row will unselect it
    if (selectedRow === idx) return setSelectedRow(null);
    return setSelectedRow(idx);
  };

  return (
    <>
      <Head>
        <title>{lendContent.pageTitle}</title>
        <meta name="description" content={lendContent.metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper heading={lendContent.pageWrapperHeading}>
        <TableContainer className="w-full rounded-xl bg-primary-100 lg:p-6">
          <Table size="md">
            <Thead>
              <Tr>
                {lendContent.tableColumns.map((column) => (
                  <Th
                    key={column.key}
                    className={classNames(["normal-case", column.className])}
                  >
                    <div className="flex items-center gap-2">
                      <Tooltip
                        label={column.tooltip}
                        isDisabled={column.tooltip == null}
                        closeDelay={500}
                      >
                        <Text
                          className={classNames({
                            "cursor-help": column.tooltip,
                          })}
                        >
                          {column.hideText !== true && column.text}
                          {column.tooltip && (
                            <ToolTipIcon
                              width={20}
                              height={20}
                              style={{
                                margin: "0px 0px 3px 5px",
                                display: "inline",
                              }}
                            />
                          )}
                        </Text>
                      </Tooltip>
                    </div>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {vaultDataWithFallback.map((vault: Vaults[number], idx) => (
                <Fragment key={idx}>
                  <Tr
                    onClick={() => onSelectedChange(idx)}
                    className={classNames([
                      "cursor-pointer",
                      "hover:bg-primary-200",
                      selectedRow === idx && "border-none bg-primary-200",
                    ])}
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <TokenIcon
                          name={vault.token.iconName}
                          height={32}
                          width={32}
                        />
                        <Text className="uppercase">{vault.token.name}</Text>
                      </div>
                    </Td>
                    <Td>
                      <Loading />
                    </Td>
                    <Td>
                      {isVaultsLoading || (isVaultsError && <Loading />)}
                      <DynamicEstimatedValue
                        value={vault.tvl}
                        token={vault.token}
                      />
                    </Td>
                    <Td className={mobileHiddenColumnClass}>
                      {isVaultsLoading || (isVaultsError && <Loading />)}
                      <DynamicEstimatedValue
                        value={vault.borrowed}
                        token={vault.token}
                      />
                    </Td>
                    <Td className={mobileHiddenColumnClass}>
                      {isVaultsLoading || (isVaultsError && <Loading />)}
                      <DynamicEstimatedValue
                        value={vault.deposited}
                        token={vault.token}
                      />
                    </Td>
                    <Td className={mobileHiddenColumnClass}>
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
                  {selectedRow === idx && (
                    <Tr>
                      <Td colSpan={lendContent.tableColumns.length}>
                        <Deposit token={vaultDataWithFallback[idx].token} />
                      </Td>
                    </Tr>
                  )}
                </Fragment>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </PageWrapper>
    </>
  );
};

export default Lend;
