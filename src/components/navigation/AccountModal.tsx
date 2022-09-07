/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useEffect, useMemo } from 'react';
import { ArrowSquareOut, Check, Copy } from 'phosphor-react';
// import ClipLoader from 'react-spinners/ClipLoader';
import {
  getExplorerAddressLink,
  getExplorerTransactionLink,
  shortenAddress,
  useEthers,
  useTransactions,
} from '@usedapp/core';
import { ClipLoader } from 'react-spinners';

import Txt from '@/components/based/Txt';
import Modal from '@/components/based/Modal';
import {
  useTheme,
  useTxTimestamp,
  useUpdateTxTimestamp,
  useWalletConnector,
  useWalletConnectorIcon,
} from '@/state/application/hooks';
import useCopyClipboard from '@/hooks/useCopyClipboard';
import { shortenString } from '@/global/utils';

interface IAccountModal {
  open: boolean;
  onClose(): void;
}

const AccountModal: FC<IAccountModal> = ({ open, onClose }) => {
  const theme = useTheme();
  const { account, chainId, deactivate } = useEthers();
  const walletConnector = useWalletConnector();
  const WalletConnectorIcon = useWalletConnectorIcon();
  const [isCopied, copyText] = useCopyClipboard();
  const txTimestamp = useTxTimestamp();
  const updateTxTimestamp = useUpdateTxTimestamp();
  const { transactions } = useTransactions({ refresh: 'everyBlock' });

  const displayedTxs = useMemo(() => {
    if (txTimestamp === 0 || !transactions.length) return [];
    return transactions.filter(
      (tx) => tx.submittedAt > txTimestamp && tx.transaction.chainId === chainId
    );
  }, [chainId, transactions, txTimestamp]);

  useEffect(() => {
    if (txTimestamp === 0) {
      updateTxTimestamp(new Date().getTime());
    }
  }, [txTimestamp, updateTxTimestamp]);

  const handleCopyAddress = () => {
    if (!account) return;
    copyText(account);
  };

  const handleOpenExplorer = () => {
    if (!account || !chainId) return;
    window.open(getExplorerAddressLink(account, chainId), '_blank');
  };

  const handleDisconnect = () => {
    deactivate();
    onClose();
  };

  return (
    <Modal tw="bg-secondary min-width[450]" open={open} onClose={onClose}>
      <div tw="w-full h-full flex flex-col">
        <Txt.Heading2 tw="text-center mb-6">Account</Txt.Heading2>
        <div tw="flex flex-row items-center justify-between mb-4">
          <Txt.Body2Regular tw="flex-grow text-font-100 capitalize">
            Connector: <i>{walletConnector}</i>
          </Txt.Body2Regular>
          <div tw="flex flex-row justify-end">
            <button
              tw="rounded-md py-1 px-2 border-1 border-primary-400 text-font-100"
              onClick={handleDisconnect}
            >
              <Txt.CaptionMedium tw="text-secondary">
                Disconnect
              </Txt.CaptionMedium>
            </button>
          </div>
        </div>

        <div tw="flex flex-row items-center mb-3">
          {!!WalletConnectorIcon && <WalletConnectorIcon tw="h-6 w-6 mr-2" />}
          {!!account && (
            <Txt.Body1Bold tw="text-secondary">
              {shortenAddress(account)}
            </Txt.Body1Bold>
          )}
        </div>

        <div tw="flex flex-row items-center justify-center mb-6">
          <div
            tw="flex items-center cursor-pointer mr-5"
            onClick={handleCopyAddress}
          >
            {isCopied ? (
              <Check size={22} tw="text-font-200 mr-2" />
            ) : (
              <Copy size={22} tw="text-font-200 mr-2" />
            )}
            <Txt.Body2Regular tw="flex-grow text-font-100">
              Copy address
            </Txt.Body2Regular>
          </div>
          <div
            tw="flex items-center cursor-pointer"
            onClick={handleOpenExplorer}
          >
            <ArrowSquareOut size={22} tw="text-font-200 mr-2" />
            <Txt.Body2Regular tw="flex-grow text-font-100">
              View on the explorer
            </Txt.Body2Regular>
          </div>
        </div>

        <div tw="w-full height[1px] bg-font-200" />
        <Txt.Heading2 tw="mt-6 text-center">Transactions</Txt.Heading2>
        {displayedTxs.length ? (
          displayedTxs.map((tx) => {
            return (
              <div key={tx.transaction.hash} tw="flex flex-row justify-between">
                <div tw="flex flex-col justify-between">
                  {chainId && (
                    <a
                      tw="mb-1"
                      rel="noreferrer"
                      href={getExplorerTransactionLink(
                        tx.transaction.hash,
                        chainId
                      )}
                      target="_blank"
                    >
                      <Txt.Body2Bold tw="text-secondary underline">
                        View Tx
                      </Txt.Body2Bold>
                    </a>
                  )}
                  <Txt.Body2Regular tw="text-font-200 overflow-hidden">
                    {shortenString(tx.transaction.hash)}
                  </Txt.Body2Regular>
                </div>
                {!tx.receipt ? (
                  <div tw="flex flex-col justify-between items-center self-center">
                    <ClipLoader
                      loading
                      color={theme == 'dark' ? '#fff' : '#000'}
                      size={18}
                      tw="mb-1.5"
                    />
                    <Txt.CaptionMedium tw="text-font-200">
                      Pending
                    </Txt.CaptionMedium>
                  </div>
                ) : (
                  <div tw="flex flex-col items-center self-center">
                    {tx.receipt.status === 1 ? (
                      <>
                        <div tw="flex items-center justify-center h-5 w-5 rounded-3xl bg-success">
                          <Check tw="text-primary w-3 h-3" />
                        </div>
                        <Txt.CaptionMedium tw="text-success">
                          Succeeded
                        </Txt.CaptionMedium>
                      </>
                    ) : (
                      <>
                        <div tw="flex items-center justify-center h-5 w-5 rounded-3xl bg-error">
                          <Check tw="text-primary w-3 h-3" />
                        </div>
                        <Txt.CaptionMedium tw="text-error">
                          Failed
                        </Txt.CaptionMedium>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <Txt.Body2Regular tw="mt-6 mb-5 flex-grow text-font-200 text-center">
            Your transactions will appear here.
          </Txt.Body2Regular>
        )}
      </div>
    </Modal>
  );
};

export default AccountModal;
