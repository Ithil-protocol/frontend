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
// CallOption
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const callOptionABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "_manager", internalType: "address", type: "address" },
      { name: "_ithil", internalType: "address", type: "address" },
      { name: "_initialPrice", internalType: "uint256", type: "uint256" },
      { name: "_halvingTime", internalType: "uint256", type: "uint256" },
      { name: "_tenorDuration", internalType: "uint256", type: "uint256" },
      { name: "_initialVesting", internalType: "uint256", type: "uint256" },
      { name: "_underlying", internalType: "address", type: "address" },
    ],
  },
  { type: "error", inputs: [], name: "InvalidCalledPortion" },
  { type: "error", inputs: [], name: "InvalidInput" },
  { type: "error", inputs: [], name: "InvalidIthilToken" },
  { type: "error", inputs: [], name: "InvalidStatus" },
  { type: "error", inputs: [], name: "InvalidUnderlyingToken" },
  { type: "error", inputs: [], name: "LockPeriodStillActive" },
  { type: "error", inputs: [], name: "Locked" },
  { type: "error", inputs: [], name: "MaxLockExceeded" },
  { type: "error", inputs: [], name: "MaxPurchaseExceeded" },
  { type: "error", inputs: [], name: "RestrictedAccess" },
  { type: "error", inputs: [], name: "RestrictedToOwner" },
  { type: "error", inputs: [], name: "SlippageExceeded" },
  { type: "error", inputs: [], name: "StillVested" },
  { type: "error", inputs: [], name: "ZeroAmount" },
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
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "allocateIthil",
    outputs: [],
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
    name: "currentPrice",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
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
      { name: "data", internalType: "bytes", type: "bytes" },
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
    name: "halvingTime",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
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
    inputs: [],
    name: "initialPrice",
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
    name: "ithil",
    outputs: [{ name: "", internalType: "contract IERC20", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "latestOpen",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "latestSpread",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
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
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "sweepIthil",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tenorDuration",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
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
    name: "totalAllocation",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
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
    name: "underlying",
    outputs: [{ name: "", internalType: "contract IERC20", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "vestingTime",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__.
 */
export function useCallOptionRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"agreements"`.
 */
export function useCallOptionAgreements<
  TFunctionName extends "agreements",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "agreements",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useCallOptionBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"currentPrice"`.
 */
export function useCallOptionCurrentPrice<
  TFunctionName extends "currentPrice",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "currentPrice",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"deadline"`.
 */
export function useCallOptionDeadline<
  TFunctionName extends "deadline",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "deadline",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"dueAmount"`.
 */
export function useCallOptionDueAmount<
  TFunctionName extends "dueAmount",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "dueAmount",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"getAgreement"`.
 */
export function useCallOptionGetAgreement<
  TFunctionName extends "getAgreement",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "getAgreement",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"getApproved"`.
 */
export function useCallOptionGetApproved<
  TFunctionName extends "getApproved",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "getApproved",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"getUserAgreements"`.
 */
export function useCallOptionGetUserAgreements<
  TFunctionName extends "getUserAgreements",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "getUserAgreements",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"guardian"`.
 */
export function useCallOptionGuardian<
  TFunctionName extends "guardian",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "guardian",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"halvingTime"`.
 */
export function useCallOptionHalvingTime<
  TFunctionName extends "halvingTime",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "halvingTime",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"id"`.
 */
export function useCallOptionId<
  TFunctionName extends "id",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "id",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"initialPrice"`.
 */
export function useCallOptionInitialPrice<
  TFunctionName extends "initialPrice",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "initialPrice",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useCallOptionIsApprovedForAll<
  TFunctionName extends "isApprovedForAll",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "isApprovedForAll",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"ithil"`.
 */
export function useCallOptionIthil<
  TFunctionName extends "ithil",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "ithil",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"latestOpen"`.
 */
export function useCallOptionLatestOpen<
  TFunctionName extends "latestOpen",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "latestOpen",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"latestSpread"`.
 */
export function useCallOptionLatestSpread<
  TFunctionName extends "latestSpread",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "latestSpread",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"locked"`.
 */
export function useCallOptionLocked<
  TFunctionName extends "locked",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "locked",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"manager"`.
 */
export function useCallOptionManager<
  TFunctionName extends "manager",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "manager",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"name"`.
 */
export function useCallOptionName<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"owner"`.
 */
export function useCallOptionOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useCallOptionOwnerOf<
  TFunctionName extends "ownerOf",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "ownerOf",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useCallOptionSupportsInterface<
  TFunctionName extends "supportsInterface",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "supportsInterface",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"symbol"`.
 */
export function useCallOptionSymbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"tenorDuration"`.
 */
export function useCallOptionTenorDuration<
  TFunctionName extends "tenorDuration",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "tenorDuration",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"tokenByIndex"`.
 */
export function useCallOptionTokenByIndex<
  TFunctionName extends "tokenByIndex",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "tokenByIndex",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"tokenOfOwnerByIndex"`.
 */
export function useCallOptionTokenOfOwnerByIndex<
  TFunctionName extends "tokenOfOwnerByIndex",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "tokenOfOwnerByIndex",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useCallOptionTokenUri<
  TFunctionName extends "tokenURI",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "tokenURI",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"totalAllocation"`.
 */
export function useCallOptionTotalAllocation<
  TFunctionName extends "totalAllocation",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "totalAllocation",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useCallOptionTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"underlying"`.
 */
export function useCallOptionUnderlying<
  TFunctionName extends "underlying",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "underlying",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"vestingTime"`.
 */
export function useCallOptionVestingTime<
  TFunctionName extends "vestingTime",
  TSelectData = ReadContractResult<typeof callOptionABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: callOptionABI,
    functionName: "vestingTime",
    ...config,
  } as UseContractReadConfig<typeof callOptionABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__.
 */
export function useCallOptionWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof callOptionABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, TFunctionName, TMode>({
    abi: callOptionABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"allocateIthil"`.
 */
export function useCallOptionAllocateIthil<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "allocateIthil"
        >["request"]["abi"],
        "allocateIthil",
        TMode
      > & { functionName?: "allocateIthil" }
    : UseContractWriteConfig<typeof callOptionABI, "allocateIthil", TMode> & {
        abi?: never;
        functionName?: "allocateIthil";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "allocateIthil", TMode>({
    abi: callOptionABI,
    functionName: "allocateIthil",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"approve"`.
 */
export function useCallOptionApprove<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "approve"
        >["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof callOptionABI, "approve", TMode> & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "approve", TMode>({
    abi: callOptionABI,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"close"`.
 */
export function useCallOptionClose<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "close"
        >["request"]["abi"],
        "close",
        TMode
      > & { functionName?: "close" }
    : UseContractWriteConfig<typeof callOptionABI, "close", TMode> & {
        abi?: never;
        functionName?: "close";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "close", TMode>({
    abi: callOptionABI,
    functionName: "close",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"edit"`.
 */
export function useCallOptionEdit<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "edit"
        >["request"]["abi"],
        "edit",
        TMode
      > & { functionName?: "edit" }
    : UseContractWriteConfig<typeof callOptionABI, "edit", TMode> & {
        abi?: never;
        functionName?: "edit";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "edit", TMode>({
    abi: callOptionABI,
    functionName: "edit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"open"`.
 */
export function useCallOptionOpen<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "open"
        >["request"]["abi"],
        "open",
        TMode
      > & { functionName?: "open" }
    : UseContractWriteConfig<typeof callOptionABI, "open", TMode> & {
        abi?: never;
        functionName?: "open";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "open", TMode>({
    abi: callOptionABI,
    functionName: "open",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useCallOptionRenounceOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "renounceOwnership"
        >["request"]["abi"],
        "renounceOwnership",
        TMode
      > & { functionName?: "renounceOwnership" }
    : UseContractWriteConfig<
        typeof callOptionABI,
        "renounceOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "renounceOwnership";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "renounceOwnership", TMode>({
    abi: callOptionABI,
    functionName: "renounceOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useCallOptionSafeTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "safeTransferFrom"
        >["request"]["abi"],
        "safeTransferFrom",
        TMode
      > & { functionName?: "safeTransferFrom" }
    : UseContractWriteConfig<
        typeof callOptionABI,
        "safeTransferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "safeTransferFrom";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "safeTransferFrom", TMode>({
    abi: callOptionABI,
    functionName: "safeTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useCallOptionSetApprovalForAll<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "setApprovalForAll"
        >["request"]["abi"],
        "setApprovalForAll",
        TMode
      > & { functionName?: "setApprovalForAll" }
    : UseContractWriteConfig<
        typeof callOptionABI,
        "setApprovalForAll",
        TMode
      > & {
        abi?: never;
        functionName?: "setApprovalForAll";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "setApprovalForAll", TMode>({
    abi: callOptionABI,
    functionName: "setApprovalForAll",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"setGuardian"`.
 */
export function useCallOptionSetGuardian<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "setGuardian"
        >["request"]["abi"],
        "setGuardian",
        TMode
      > & { functionName?: "setGuardian" }
    : UseContractWriteConfig<typeof callOptionABI, "setGuardian", TMode> & {
        abi?: never;
        functionName?: "setGuardian";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "setGuardian", TMode>({
    abi: callOptionABI,
    functionName: "setGuardian",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"sweepIthil"`.
 */
export function useCallOptionSweepIthil<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "sweepIthil"
        >["request"]["abi"],
        "sweepIthil",
        TMode
      > & { functionName?: "sweepIthil" }
    : UseContractWriteConfig<typeof callOptionABI, "sweepIthil", TMode> & {
        abi?: never;
        functionName?: "sweepIthil";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "sweepIthil", TMode>({
    abi: callOptionABI,
    functionName: "sweepIthil",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"toggleLock"`.
 */
export function useCallOptionToggleLock<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "toggleLock"
        >["request"]["abi"],
        "toggleLock",
        TMode
      > & { functionName?: "toggleLock" }
    : UseContractWriteConfig<typeof callOptionABI, "toggleLock", TMode> & {
        abi?: never;
        functionName?: "toggleLock";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "toggleLock", TMode>({
    abi: callOptionABI,
    functionName: "toggleLock",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useCallOptionTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof callOptionABI, "transferFrom", TMode> & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "transferFrom", TMode>({
    abi: callOptionABI,
    functionName: "transferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useCallOptionTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof callOptionABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<
        typeof callOptionABI,
        "transferOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<typeof callOptionABI, "transferOwnership", TMode>({
    abi: callOptionABI,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__.
 */
export function usePrepareCallOptionWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"allocateIthil"`.
 */
export function usePrepareCallOptionAllocateIthil(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "allocateIthil">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "allocateIthil",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "allocateIthil">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareCallOptionApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "approve">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"close"`.
 */
export function usePrepareCallOptionClose(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "close">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "close",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "close">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"edit"`.
 */
export function usePrepareCallOptionEdit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "edit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "edit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "edit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"open"`.
 */
export function usePrepareCallOptionOpen(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "open">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "open",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "open">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareCallOptionRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "renounceOwnership">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "renounceOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "renounceOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareCallOptionSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "safeTransferFrom">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "safeTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "safeTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareCallOptionSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "setApprovalForAll">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "setApprovalForAll",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "setApprovalForAll">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"setGuardian"`.
 */
export function usePrepareCallOptionSetGuardian(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "setGuardian">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "setGuardian",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "setGuardian">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"sweepIthil"`.
 */
export function usePrepareCallOptionSweepIthil(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "sweepIthil">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "sweepIthil",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "sweepIthil">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"toggleLock"`.
 */
export function usePrepareCallOptionToggleLock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "toggleLock">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "toggleLock",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "toggleLock">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareCallOptionTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "transferFrom">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "transferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link callOptionABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareCallOptionTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof callOptionABI, "transferOwnership">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: callOptionABI,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof callOptionABI, "transferOwnership">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__.
 */
export function useCallOptionEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"Approval"`.
 */
export function useCallOptionApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "Approval">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useCallOptionApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "ApprovalForAll">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "ApprovalForAll",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "ApprovalForAll">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"BaseRiskSpreadWasUpdated"`.
 */
export function useCallOptionBaseRiskSpreadWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "BaseRiskSpreadWasUpdated">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "BaseRiskSpreadWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "BaseRiskSpreadWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"GuardianWasUpdated"`.
 */
export function useCallOptionGuardianWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "GuardianWasUpdated">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "GuardianWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "GuardianWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"LockWasToggled"`.
 */
export function useCallOptionLockWasToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "LockWasToggled">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "LockWasToggled",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "LockWasToggled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useCallOptionOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "OwnershipTransferred">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"PositionClosed"`.
 */
export function useCallOptionPositionClosedEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "PositionClosed">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "PositionClosed",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "PositionClosed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"PositionOpened"`.
 */
export function useCallOptionPositionOpenedEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "PositionOpened">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "PositionOpened",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "PositionOpened">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link callOptionABI}__ and `eventName` set to `"Transfer"`.
 */
export function useCallOptionTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof callOptionABI, "Transfer">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: callOptionABI,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof callOptionABI, "Transfer">);
}
