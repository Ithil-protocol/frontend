import {
  UseContractEventConfig,
  UseContractReadConfig,
  UseContractWriteConfig,
  UsePrepareContractWriteConfig,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  PrepareWriteContractResult,
  ReadContractResult,
  WriteContractMode,
} from "wagmi/actions";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FixedYield
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fixedYieldABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "_manager", internalType: "address", type: "address" },
      { name: "_yield", internalType: "uint256", type: "uint256" },
      { name: "_deadline", internalType: "uint256", type: "uint256" },
    ],
  },
  { type: "error", inputs: [], name: "InvalidInput" },
  { type: "error", inputs: [], name: "InvalidStatus" },
  { type: "error", inputs: [], name: "Locked" },
  { type: "error", inputs: [], name: "RestrictedAccess" },
  { type: "error", inputs: [], name: "RestrictedToOwner" },
  { type: "error", inputs: [], name: "SlippageExceeded" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "approved",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "tokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "operator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "approved", internalType: "bool", type: "bool", indexed: false },
    ],
    name: "ApprovalForAll",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "asset",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
      {
        name: "newValue",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "BaseRiskSpreadWasUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "newGuardian",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "GuardianWasUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "status", internalType: "bool", type: "bool", indexed: false },
    ],
    name: "LockWasToggled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "previousOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "newOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "OwnershipTransferred",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
      { name: "user", internalType: "address", type: "address", indexed: true },
      {
        name: "agreement",
        internalType: "struct IService.Agreement",
        type: "tuple",
        components: [
          {
            name: "loans",
            internalType: "struct IService.Loan[]",
            type: "tuple[]",
            components: [
              { name: "token", internalType: "address", type: "address" },
              { name: "amount", internalType: "uint256", type: "uint256" },
              { name: "margin", internalType: "uint256", type: "uint256" },
              {
                name: "interestAndSpread",
                internalType: "uint256",
                type: "uint256",
              },
            ],
          },
          {
            name: "collaterals",
            internalType: "struct IService.Collateral[]",
            type: "tuple[]",
            components: [
              {
                name: "itemType",
                internalType: "enum IService.ItemType",
                type: "uint8",
              },
              { name: "token", internalType: "address", type: "address" },
              { name: "identifier", internalType: "uint256", type: "uint256" },
              { name: "amount", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "createdAt", internalType: "uint256", type: "uint256" },
          {
            name: "status",
            internalType: "enum IService.Status",
            type: "uint8",
          },
        ],
        indexed: false,
      },
    ],
    name: "PositionClosed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
      { name: "user", internalType: "address", type: "address", indexed: true },
      {
        name: "agreement",
        internalType: "struct IService.Agreement",
        type: "tuple",
        components: [
          {
            name: "loans",
            internalType: "struct IService.Loan[]",
            type: "tuple[]",
            components: [
              { name: "token", internalType: "address", type: "address" },
              { name: "amount", internalType: "uint256", type: "uint256" },
              { name: "margin", internalType: "uint256", type: "uint256" },
              {
                name: "interestAndSpread",
                internalType: "uint256",
                type: "uint256",
              },
            ],
          },
          {
            name: "collaterals",
            internalType: "struct IService.Collateral[]",
            type: "tuple[]",
            components: [
              {
                name: "itemType",
                internalType: "enum IService.ItemType",
                type: "uint8",
              },
              { name: "token", internalType: "address", type: "address" },
              { name: "identifier", internalType: "uint256", type: "uint256" },
              { name: "amount", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "createdAt", internalType: "uint256", type: "uint256" },
          {
            name: "status",
            internalType: "enum IService.Status",
            type: "uint8",
          },
        ],
        indexed: false,
      },
    ],
    name: "PositionOpened",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "tokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
    ],
    name: "Transfer",
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "agreements",
    outputs: [
      { name: "createdAt", internalType: "uint256", type: "uint256" },
      { name: "status", internalType: "enum IService.Status", type: "uint8" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "tokenID", internalType: "uint256", type: "uint256" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "close",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "deadline",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      {
        name: "agreement",
        internalType: "struct IService.Agreement",
        type: "tuple",
        components: [
          {
            name: "loans",
            internalType: "struct IService.Loan[]",
            type: "tuple[]",
            components: [
              { name: "token", internalType: "address", type: "address" },
              { name: "amount", internalType: "uint256", type: "uint256" },
              { name: "margin", internalType: "uint256", type: "uint256" },
              {
                name: "interestAndSpread",
                internalType: "uint256",
                type: "uint256",
              },
            ],
          },
          {
            name: "collaterals",
            internalType: "struct IService.Collateral[]",
            type: "tuple[]",
            components: [
              {
                name: "itemType",
                internalType: "enum IService.ItemType",
                type: "uint8",
              },
              { name: "token", internalType: "address", type: "address" },
              { name: "identifier", internalType: "uint256", type: "uint256" },
              { name: "amount", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "createdAt", internalType: "uint256", type: "uint256" },
          {
            name: "status",
            internalType: "enum IService.Status",
            type: "uint8",
          },
        ],
      },
      { name: "", internalType: "bytes", type: "bytes" },
    ],
    name: "dueAmount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "tokenID", internalType: "uint256", type: "uint256" },
      {
        name: "agreement",
        internalType: "struct IService.Agreement",
        type: "tuple",
        components: [
          {
            name: "loans",
            internalType: "struct IService.Loan[]",
            type: "tuple[]",
            components: [
              { name: "token", internalType: "address", type: "address" },
              { name: "amount", internalType: "uint256", type: "uint256" },
              { name: "margin", internalType: "uint256", type: "uint256" },
              {
                name: "interestAndSpread",
                internalType: "uint256",
                type: "uint256",
              },
            ],
          },
          {
            name: "collaterals",
            internalType: "struct IService.Collateral[]",
            type: "tuple[]",
            components: [
              {
                name: "itemType",
                internalType: "enum IService.ItemType",
                type: "uint8",
              },
              { name: "token", internalType: "address", type: "address" },
              { name: "identifier", internalType: "uint256", type: "uint256" },
              { name: "amount", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "createdAt", internalType: "uint256", type: "uint256" },
          {
            name: "status",
            internalType: "enum IService.Status",
            type: "uint8",
          },
        ],
      },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "edit",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenID", internalType: "uint256", type: "uint256" }],
    name: "getAgreement",
    outputs: [
      {
        name: "",
        internalType: "struct IService.Loan[]",
        type: "tuple[]",
        components: [
          { name: "token", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "margin", internalType: "uint256", type: "uint256" },
          {
            name: "interestAndSpread",
            internalType: "uint256",
            type: "uint256",
          },
        ],
      },
      {
        name: "",
        internalType: "struct IService.Collateral[]",
        type: "tuple[]",
        components: [
          {
            name: "itemType",
            internalType: "enum IService.ItemType",
            type: "uint8",
          },
          { name: "token", internalType: "address", type: "address" },
          { name: "identifier", internalType: "uint256", type: "uint256" },
          { name: "amount", internalType: "uint256", type: "uint256" },
        ],
      },
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "enum IService.Status", type: "uint8" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "uint256", type: "uint256" }],
    name: "getApproved",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "getUserAgreements",
    outputs: [
      {
        name: "",
        internalType: "struct IService.Agreement[]",
        type: "tuple[]",
        components: [
          {
            name: "loans",
            internalType: "struct IService.Loan[]",
            type: "tuple[]",
            components: [
              { name: "token", internalType: "address", type: "address" },
              { name: "amount", internalType: "uint256", type: "uint256" },
              { name: "margin", internalType: "uint256", type: "uint256" },
              {
                name: "interestAndSpread",
                internalType: "uint256",
                type: "uint256",
              },
            ],
          },
          {
            name: "collaterals",
            internalType: "struct IService.Collateral[]",
            type: "tuple[]",
            components: [
              {
                name: "itemType",
                internalType: "enum IService.ItemType",
                type: "uint8",
              },
              { name: "token", internalType: "address", type: "address" },
              { name: "identifier", internalType: "uint256", type: "uint256" },
              { name: "amount", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "createdAt", internalType: "uint256", type: "uint256" },
          {
            name: "status",
            internalType: "enum IService.Status",
            type: "uint8",
          },
        ],
      },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "guardian",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "id",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "operator", internalType: "address", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "locked",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "manager",
    outputs: [{ name: "", internalType: "contract IManager", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      {
        name: "order",
        internalType: "struct IService.Order",
        type: "tuple",
        components: [
          {
            name: "agreement",
            internalType: "struct IService.Agreement",
            type: "tuple",
            components: [
              {
                name: "loans",
                internalType: "struct IService.Loan[]",
                type: "tuple[]",
                components: [
                  { name: "token", internalType: "address", type: "address" },
                  { name: "amount", internalType: "uint256", type: "uint256" },
                  { name: "margin", internalType: "uint256", type: "uint256" },
                  {
                    name: "interestAndSpread",
                    internalType: "uint256",
                    type: "uint256",
                  },
                ],
              },
              {
                name: "collaterals",
                internalType: "struct IService.Collateral[]",
                type: "tuple[]",
                components: [
                  {
                    name: "itemType",
                    internalType: "enum IService.ItemType",
                    type: "uint8",
                  },
                  { name: "token", internalType: "address", type: "address" },
                  {
                    name: "identifier",
                    internalType: "uint256",
                    type: "uint256",
                  },
                  { name: "amount", internalType: "uint256", type: "uint256" },
                ],
              },
              { name: "createdAt", internalType: "uint256", type: "uint256" },
              {
                name: "status",
                internalType: "enum IService.Status",
                type: "uint8",
              },
            ],
          },
          { name: "data", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "open",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "uint256", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "operator", internalType: "address", type: "address" },
      { name: "approved", internalType: "bool", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "_guardian", internalType: "address", type: "address" }],
    name: "setGuardian",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "interfaceId", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "_locked", internalType: "bool", type: "bool" }],
    name: "toggleLock",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "index", internalType: "uint256", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "index", internalType: "uint256", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "uint256", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "yield",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
] as const;

export const fixedYieldAddress =
  "0x66D2aA3C2E37DB2DEf62477b7F6C94B4c789773F" as const;

export const fixedYieldConfig = {
  address: fixedYieldAddress,
  abi: fixedYieldABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__.
 */
export function useFixedYieldRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"agreements"`.
 */
export function useFixedYieldAgreements<
  TFunctionName extends "agreements",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "agreements",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useFixedYieldBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"deadline"`.
 */
export function useFixedYieldDeadline<
  TFunctionName extends "deadline",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "deadline",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"dueAmount"`.
 */
export function useFixedYieldDueAmount<
  TFunctionName extends "dueAmount",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "dueAmount",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"getAgreement"`.
 */
export function useFixedYieldGetAgreement<
  TFunctionName extends "getAgreement",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "getAgreement",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"getApproved"`.
 */
export function useFixedYieldGetApproved<
  TFunctionName extends "getApproved",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "getApproved",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"getUserAgreements"`.
 */
export function useFixedYieldGetUserAgreements<
  TFunctionName extends "getUserAgreements",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "getUserAgreements",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"guardian"`.
 */
export function useFixedYieldGuardian<
  TFunctionName extends "guardian",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "guardian",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"id"`.
 */
export function useFixedYieldId<
  TFunctionName extends "id",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "id",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useFixedYieldIsApprovedForAll<
  TFunctionName extends "isApprovedForAll",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "isApprovedForAll",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"locked"`.
 */
export function useFixedYieldLocked<
  TFunctionName extends "locked",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "locked",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"manager"`.
 */
export function useFixedYieldManager<
  TFunctionName extends "manager",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "manager",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"name"`.
 */
export function useFixedYieldName<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"owner"`.
 */
export function useFixedYieldOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useFixedYieldOwnerOf<
  TFunctionName extends "ownerOf",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "ownerOf",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useFixedYieldSupportsInterface<
  TFunctionName extends "supportsInterface",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "supportsInterface",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"symbol"`.
 */
export function useFixedYieldSymbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"tokenByIndex"`.
 */
export function useFixedYieldTokenByIndex<
  TFunctionName extends "tokenByIndex",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "tokenByIndex",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"tokenOfOwnerByIndex"`.
 */
export function useFixedYieldTokenOfOwnerByIndex<
  TFunctionName extends "tokenOfOwnerByIndex",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "tokenOfOwnerByIndex",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useFixedYieldTokenUri<
  TFunctionName extends "tokenURI",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "tokenURI",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useFixedYieldTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"yield"`.
 */
export function useFixedYieldYield<
  TFunctionName extends "yield",
  TSelectData = ReadContractResult<typeof fixedYieldABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "yield",
    ...config,
  } as UseContractReadConfig<typeof fixedYieldABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__.
 */
export function useFixedYieldWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof fixedYieldABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, TFunctionName, TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"approve"`.
 */
export function useFixedYieldApprove<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "approve"
        >["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof fixedYieldABI, "approve", TMode> & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "approve", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"close"`.
 */
export function useFixedYieldClose<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "close"
        >["request"]["abi"],
        "close",
        TMode
      > & { functionName?: "close" }
    : UseContractWriteConfig<typeof fixedYieldABI, "close", TMode> & {
        abi?: never;
        functionName?: "close";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "close", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "close",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"edit"`.
 */
export function useFixedYieldEdit<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "edit"
        >["request"]["abi"],
        "edit",
        TMode
      > & { functionName?: "edit" }
    : UseContractWriteConfig<typeof fixedYieldABI, "edit", TMode> & {
        abi?: never;
        functionName?: "edit";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "edit", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "edit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"open"`.
 */
export function useFixedYieldOpen<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "open"
        >["request"]["abi"],
        "open",
        TMode
      > & { functionName?: "open" }
    : UseContractWriteConfig<typeof fixedYieldABI, "open", TMode> & {
        abi?: never;
        functionName?: "open";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "open", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "open",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useFixedYieldRenounceOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "renounceOwnership"
        >["request"]["abi"],
        "renounceOwnership",
        TMode
      > & { functionName?: "renounceOwnership" }
    : UseContractWriteConfig<
        typeof fixedYieldABI,
        "renounceOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "renounceOwnership";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "renounceOwnership", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "renounceOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useFixedYieldSafeTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "safeTransferFrom"
        >["request"]["abi"],
        "safeTransferFrom",
        TMode
      > & { functionName?: "safeTransferFrom" }
    : UseContractWriteConfig<
        typeof fixedYieldABI,
        "safeTransferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "safeTransferFrom";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "safeTransferFrom", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "safeTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useFixedYieldSetApprovalForAll<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "setApprovalForAll"
        >["request"]["abi"],
        "setApprovalForAll",
        TMode
      > & { functionName?: "setApprovalForAll" }
    : UseContractWriteConfig<
        typeof fixedYieldABI,
        "setApprovalForAll",
        TMode
      > & {
        abi?: never;
        functionName?: "setApprovalForAll";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "setApprovalForAll", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "setApprovalForAll",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"setGuardian"`.
 */
export function useFixedYieldSetGuardian<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "setGuardian"
        >["request"]["abi"],
        "setGuardian",
        TMode
      > & { functionName?: "setGuardian" }
    : UseContractWriteConfig<typeof fixedYieldABI, "setGuardian", TMode> & {
        abi?: never;
        functionName?: "setGuardian";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "setGuardian", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "setGuardian",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"toggleLock"`.
 */
export function useFixedYieldToggleLock<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "toggleLock"
        >["request"]["abi"],
        "toggleLock",
        TMode
      > & { functionName?: "toggleLock" }
    : UseContractWriteConfig<typeof fixedYieldABI, "toggleLock", TMode> & {
        abi?: never;
        functionName?: "toggleLock";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "toggleLock", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "toggleLock",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useFixedYieldTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof fixedYieldABI, "transferFrom", TMode> & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "transferFrom", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "transferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useFixedYieldTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof fixedYieldABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<
        typeof fixedYieldABI,
        "transferOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<typeof fixedYieldABI, "transferOwnership", TMode>({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__.
 */
export function usePrepareFixedYieldWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, TFunctionName>,
    "abi" | "address"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareFixedYieldApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "approve">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"close"`.
 */
export function usePrepareFixedYieldClose(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "close">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "close",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "close">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"edit"`.
 */
export function usePrepareFixedYieldEdit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "edit">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "edit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "edit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"open"`.
 */
export function usePrepareFixedYieldOpen(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "open">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "open",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "open">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareFixedYieldRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "renounceOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "renounceOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "renounceOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareFixedYieldSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "safeTransferFrom">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "safeTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "safeTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareFixedYieldSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "setApprovalForAll">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "setApprovalForAll",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "setApprovalForAll">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"setGuardian"`.
 */
export function usePrepareFixedYieldSetGuardian(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "setGuardian">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "setGuardian",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "setGuardian">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"toggleLock"`.
 */
export function usePrepareFixedYieldToggleLock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "toggleLock">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "toggleLock",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "toggleLock">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareFixedYieldTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "transferFrom">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "transferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link fixedYieldABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareFixedYieldTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof fixedYieldABI, "transferOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof fixedYieldABI, "transferOwnership">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__.
 */
export function useFixedYieldEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, TEventName>,
    "abi" | "address"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"Approval"`.
 */
export function useFixedYieldApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "Approval">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useFixedYieldApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "ApprovalForAll">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "ApprovalForAll",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "ApprovalForAll">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"BaseRiskSpreadWasUpdated"`.
 */
export function useFixedYieldBaseRiskSpreadWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "BaseRiskSpreadWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "BaseRiskSpreadWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "BaseRiskSpreadWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"GuardianWasUpdated"`.
 */
export function useFixedYieldGuardianWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "GuardianWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "GuardianWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "GuardianWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"LockWasToggled"`.
 */
export function useFixedYieldLockWasToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "LockWasToggled">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "LockWasToggled",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "LockWasToggled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useFixedYieldOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "OwnershipTransferred">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"PositionClosed"`.
 */
export function useFixedYieldPositionClosedEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "PositionClosed">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "PositionClosed",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "PositionClosed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"PositionOpened"`.
 */
export function useFixedYieldPositionOpenedEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "PositionOpened">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "PositionOpened",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "PositionOpened">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link fixedYieldABI}__ and `eventName` set to `"Transfer"`.
 */
export function useFixedYieldTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof fixedYieldABI, "Transfer">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: fixedYieldABI,
    address: fixedYieldAddress,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof fixedYieldABI, "Transfer">);
}
