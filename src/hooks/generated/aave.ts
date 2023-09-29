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
// Aave
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aaveABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "_manager", internalType: "address", type: "address" },
      { name: "_aave", internalType: "address", type: "address" },
      { name: "_deadline", internalType: "uint256", type: "uint256" },
    ],
  },
  { type: "error", inputs: [], name: "AboveRiskThreshold" },
  { type: "error", inputs: [], name: "ImpossibleToQuote" },
  { type: "error", inputs: [], name: "IncorrectObtainedToken" },
  { type: "error", inputs: [], name: "InsufficientAmountOut" },
  { type: "error", inputs: [], name: "InterestRateOverflow" },
  { type: "error", inputs: [], name: "InvalidInitParams" },
  { type: "error", inputs: [], name: "InvalidStatus" },
  { type: "error", inputs: [], name: "Locked" },
  { type: "error", inputs: [], name: "LossByArbitraryAddress" },
  { type: "error", inputs: [], name: "MarginTooLow" },
  { type: "error", inputs: [], name: "RestrictedAccess" },
  { type: "error", inputs: [], name: "RestrictedToOwner" },
  { type: "error", inputs: [], name: "UserIsNotWhitelisted" },
  { type: "error", inputs: [], name: "ZeroCollateral" },
  { type: "error", inputs: [], name: "ZeroMarginLoan" },
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
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "liquidator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "payoff",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "LiquidationTriggered",
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
    type: "event",
    anonymous: false,
    inputs: [],
    name: "WhitelistAccessFlagWasToggled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "user", internalType: "address", type: "address", indexed: true },
      { name: "status", internalType: "bool", type: "bool", indexed: false },
    ],
    name: "WhitelistedStatusWasChanged",
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "aave",
    outputs: [{ name: "", internalType: "contract IPool", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "users", internalType: "address[]", type: "address[]" }],
    name: "addToWhitelist",
    outputs: [],
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
    outputs: [
      { name: "amountsOut", internalType: "uint256[]", type: "uint256[]" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "loan", internalType: "uint256", type: "uint256" },
      { name: "margin", internalType: "uint256", type: "uint256" },
      { name: "freeLiquidity", internalType: "uint256", type: "uint256" },
    ],
    name: "computeBaseRateAndSpread",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
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
    ],
    name: "computeDueFees",
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
    inputs: [],
    name: "enabled",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
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
    inputs: [{ name: "", internalType: "address", type: "address" }],
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
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "latestAndBase",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "id", internalType: "uint256", type: "uint256" }],
    name: "liquidationScore",
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
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "minMargin",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
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
    ],
    name: "quote",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "users", internalType: "address[]", type: "address[]" }],
    name: "removeFromWhitelist",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "riskSpreads",
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
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "margin", internalType: "uint256", type: "uint256" },
    ],
    name: "setMinMargin",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "riskSpread", internalType: "uint256", type: "uint256" },
      { name: "baseRate", internalType: "uint256", type: "uint256" },
      { name: "halfTime", internalType: "uint256", type: "uint256" },
    ],
    name: "setRiskParams",
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
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "toggleWhitelistFlag",
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
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "totalAllowance",
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
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "whitelisted",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
] as const;

export const aaveAddress =
  "0xB702289fC4bC69e73210b34f55f2F537a9bfd0Ec" as const;

export const aaveConfig = { address: aaveAddress, abi: aaveABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__.
 */
export function useAaveRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"aave"`.
 */
export function useAaveAave<
  TFunctionName extends "aave",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "aave",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"agreements"`.
 */
export function useAaveAgreements<
  TFunctionName extends "agreements",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "agreements",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useAaveBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"computeBaseRateAndSpread"`.
 */
export function useAaveComputeBaseRateAndSpread<
  TFunctionName extends "computeBaseRateAndSpread",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "computeBaseRateAndSpread",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"computeDueFees"`.
 */
export function useAaveComputeDueFees<
  TFunctionName extends "computeDueFees",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "computeDueFees",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"deadline"`.
 */
export function useAaveDeadline<
  TFunctionName extends "deadline",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "deadline",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"enabled"`.
 */
export function useAaveEnabled<
  TFunctionName extends "enabled",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "enabled",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"getAgreement"`.
 */
export function useAaveGetAgreement<
  TFunctionName extends "getAgreement",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "getAgreement",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"getApproved"`.
 */
export function useAaveGetApproved<
  TFunctionName extends "getApproved",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "getApproved",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"getUserAgreements"`.
 */
export function useAaveGetUserAgreements<
  TFunctionName extends "getUserAgreements",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "getUserAgreements",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"guardian"`.
 */
export function useAaveGuardian<
  TFunctionName extends "guardian",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "guardian",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"halvingTime"`.
 */
export function useAaveHalvingTime<
  TFunctionName extends "halvingTime",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "halvingTime",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"id"`.
 */
export function useAaveId<
  TFunctionName extends "id",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "id",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useAaveIsApprovedForAll<
  TFunctionName extends "isApprovedForAll",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "isApprovedForAll",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"latestAndBase"`.
 */
export function useAaveLatestAndBase<
  TFunctionName extends "latestAndBase",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "latestAndBase",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"liquidationScore"`.
 */
export function useAaveLiquidationScore<
  TFunctionName extends "liquidationScore",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "liquidationScore",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"locked"`.
 */
export function useAaveLocked<
  TFunctionName extends "locked",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "locked",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"manager"`.
 */
export function useAaveManager<
  TFunctionName extends "manager",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "manager",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"minMargin"`.
 */
export function useAaveMinMargin<
  TFunctionName extends "minMargin",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "minMargin",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"name"`.
 */
export function useAaveName<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"owner"`.
 */
export function useAaveOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useAaveOwnerOf<
  TFunctionName extends "ownerOf",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "ownerOf",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"quote"`.
 */
export function useAaveQuote<
  TFunctionName extends "quote",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "quote",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"riskSpreads"`.
 */
export function useAaveRiskSpreads<
  TFunctionName extends "riskSpreads",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "riskSpreads",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useAaveSupportsInterface<
  TFunctionName extends "supportsInterface",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "supportsInterface",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"symbol"`.
 */
export function useAaveSymbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"tokenByIndex"`.
 */
export function useAaveTokenByIndex<
  TFunctionName extends "tokenByIndex",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "tokenByIndex",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"tokenOfOwnerByIndex"`.
 */
export function useAaveTokenOfOwnerByIndex<
  TFunctionName extends "tokenOfOwnerByIndex",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "tokenOfOwnerByIndex",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useAaveTokenUri<
  TFunctionName extends "tokenURI",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "tokenURI",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"totalAllowance"`.
 */
export function useAaveTotalAllowance<
  TFunctionName extends "totalAllowance",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "totalAllowance",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useAaveTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"whitelisted"`.
 */
export function useAaveWhitelisted<
  TFunctionName extends "whitelisted",
  TSelectData = ReadContractResult<typeof aaveABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "whitelisted",
    ...config,
  } as UseContractReadConfig<typeof aaveABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__.
 */
export function useAaveWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof aaveABI, string>["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof aaveABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, TFunctionName, TMode>({
    abi: aaveABI,
    address: aaveAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"addToWhitelist"`.
 */
export function useAaveAddToWhitelist<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "addToWhitelist"
        >["request"]["abi"],
        "addToWhitelist",
        TMode
      > & { functionName?: "addToWhitelist" }
    : UseContractWriteConfig<typeof aaveABI, "addToWhitelist", TMode> & {
        abi?: never;
        functionName?: "addToWhitelist";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "addToWhitelist", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "addToWhitelist",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"approve"`.
 */
export function useAaveApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof aaveABI, "approve">["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof aaveABI, "approve", TMode> & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "approve", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"close"`.
 */
export function useAaveClose<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof aaveABI, "close">["request"]["abi"],
        "close",
        TMode
      > & { functionName?: "close" }
    : UseContractWriteConfig<typeof aaveABI, "close", TMode> & {
        abi?: never;
        functionName?: "close";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "close", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "close",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"edit"`.
 */
export function useAaveEdit<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof aaveABI, "edit">["request"]["abi"],
        "edit",
        TMode
      > & { functionName?: "edit" }
    : UseContractWriteConfig<typeof aaveABI, "edit", TMode> & {
        abi?: never;
        functionName?: "edit";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "edit", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "edit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"open"`.
 */
export function useAaveOpen<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof aaveABI, "open">["request"]["abi"],
        "open",
        TMode
      > & { functionName?: "open" }
    : UseContractWriteConfig<typeof aaveABI, "open", TMode> & {
        abi?: never;
        functionName?: "open";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "open", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "open",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"removeFromWhitelist"`.
 */
export function useAaveRemoveFromWhitelist<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "removeFromWhitelist"
        >["request"]["abi"],
        "removeFromWhitelist",
        TMode
      > & { functionName?: "removeFromWhitelist" }
    : UseContractWriteConfig<typeof aaveABI, "removeFromWhitelist", TMode> & {
        abi?: never;
        functionName?: "removeFromWhitelist";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "removeFromWhitelist", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "removeFromWhitelist",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useAaveRenounceOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "renounceOwnership"
        >["request"]["abi"],
        "renounceOwnership",
        TMode
      > & { functionName?: "renounceOwnership" }
    : UseContractWriteConfig<typeof aaveABI, "renounceOwnership", TMode> & {
        abi?: never;
        functionName?: "renounceOwnership";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "renounceOwnership", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "renounceOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useAaveSafeTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "safeTransferFrom"
        >["request"]["abi"],
        "safeTransferFrom",
        TMode
      > & { functionName?: "safeTransferFrom" }
    : UseContractWriteConfig<typeof aaveABI, "safeTransferFrom", TMode> & {
        abi?: never;
        functionName?: "safeTransferFrom";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "safeTransferFrom", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "safeTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useAaveSetApprovalForAll<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "setApprovalForAll"
        >["request"]["abi"],
        "setApprovalForAll",
        TMode
      > & { functionName?: "setApprovalForAll" }
    : UseContractWriteConfig<typeof aaveABI, "setApprovalForAll", TMode> & {
        abi?: never;
        functionName?: "setApprovalForAll";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "setApprovalForAll", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setApprovalForAll",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setGuardian"`.
 */
export function useAaveSetGuardian<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "setGuardian"
        >["request"]["abi"],
        "setGuardian",
        TMode
      > & { functionName?: "setGuardian" }
    : UseContractWriteConfig<typeof aaveABI, "setGuardian", TMode> & {
        abi?: never;
        functionName?: "setGuardian";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "setGuardian", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setGuardian",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setMinMargin"`.
 */
export function useAaveSetMinMargin<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "setMinMargin"
        >["request"]["abi"],
        "setMinMargin",
        TMode
      > & { functionName?: "setMinMargin" }
    : UseContractWriteConfig<typeof aaveABI, "setMinMargin", TMode> & {
        abi?: never;
        functionName?: "setMinMargin";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "setMinMargin", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setMinMargin",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setRiskParams"`.
 */
export function useAaveSetRiskParams<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "setRiskParams"
        >["request"]["abi"],
        "setRiskParams",
        TMode
      > & { functionName?: "setRiskParams" }
    : UseContractWriteConfig<typeof aaveABI, "setRiskParams", TMode> & {
        abi?: never;
        functionName?: "setRiskParams";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "setRiskParams", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setRiskParams",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"toggleLock"`.
 */
export function useAaveToggleLock<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "toggleLock"
        >["request"]["abi"],
        "toggleLock",
        TMode
      > & { functionName?: "toggleLock" }
    : UseContractWriteConfig<typeof aaveABI, "toggleLock", TMode> & {
        abi?: never;
        functionName?: "toggleLock";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "toggleLock", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "toggleLock",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"toggleWhitelistFlag"`.
 */
export function useAaveToggleWhitelistFlag<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "toggleWhitelistFlag"
        >["request"]["abi"],
        "toggleWhitelistFlag",
        TMode
      > & { functionName?: "toggleWhitelistFlag" }
    : UseContractWriteConfig<typeof aaveABI, "toggleWhitelistFlag", TMode> & {
        abi?: never;
        functionName?: "toggleWhitelistFlag";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "toggleWhitelistFlag", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "toggleWhitelistFlag",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useAaveTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof aaveABI, "transferFrom", TMode> & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "transferFrom", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "transferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useAaveTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof aaveABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<typeof aaveABI, "transferOwnership", TMode> & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<typeof aaveABI, "transferOwnership", TMode>({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__.
 */
export function usePrepareAaveWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, TFunctionName>,
    "abi" | "address"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"addToWhitelist"`.
 */
export function usePrepareAaveAddToWhitelist(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "addToWhitelist">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "addToWhitelist",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "addToWhitelist">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareAaveApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "approve">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"close"`.
 */
export function usePrepareAaveClose(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "close">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "close",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "close">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"edit"`.
 */
export function usePrepareAaveEdit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "edit">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "edit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "edit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"open"`.
 */
export function usePrepareAaveOpen(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "open">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "open",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "open">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"removeFromWhitelist"`.
 */
export function usePrepareAaveRemoveFromWhitelist(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "removeFromWhitelist">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "removeFromWhitelist",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "removeFromWhitelist">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareAaveRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "renounceOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "renounceOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "renounceOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareAaveSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "safeTransferFrom">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "safeTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "safeTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareAaveSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "setApprovalForAll">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setApprovalForAll",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "setApprovalForAll">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setGuardian"`.
 */
export function usePrepareAaveSetGuardian(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "setGuardian">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setGuardian",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "setGuardian">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setMinMargin"`.
 */
export function usePrepareAaveSetMinMargin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "setMinMargin">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setMinMargin",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "setMinMargin">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"setRiskParams"`.
 */
export function usePrepareAaveSetRiskParams(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "setRiskParams">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "setRiskParams",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "setRiskParams">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"toggleLock"`.
 */
export function usePrepareAaveToggleLock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "toggleLock">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "toggleLock",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "toggleLock">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"toggleWhitelistFlag"`.
 */
export function usePrepareAaveToggleWhitelistFlag(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "toggleWhitelistFlag">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "toggleWhitelistFlag",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "toggleWhitelistFlag">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareAaveTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "transferFrom">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "transferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link aaveABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareAaveTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof aaveABI, "transferOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof aaveABI, "transferOwnership">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__.
 */
export function useAaveEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, TEventName>,
    "abi" | "address"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    ...config,
  } as UseContractEventConfig<typeof aaveABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"Approval"`.
 */
export function useAaveApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "Approval">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useAaveApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "ApprovalForAll">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "ApprovalForAll",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "ApprovalForAll">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"BaseRiskSpreadWasUpdated"`.
 */
export function useAaveBaseRiskSpreadWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "BaseRiskSpreadWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "BaseRiskSpreadWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "BaseRiskSpreadWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"GuardianWasUpdated"`.
 */
export function useAaveGuardianWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "GuardianWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "GuardianWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "GuardianWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"LiquidationTriggered"`.
 */
export function useAaveLiquidationTriggeredEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "LiquidationTriggered">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "LiquidationTriggered",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "LiquidationTriggered">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"LockWasToggled"`.
 */
export function useAaveLockWasToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "LockWasToggled">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "LockWasToggled",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "LockWasToggled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useAaveOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "OwnershipTransferred">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"PositionClosed"`.
 */
export function useAavePositionClosedEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "PositionClosed">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "PositionClosed",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "PositionClosed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"PositionOpened"`.
 */
export function useAavePositionOpenedEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "PositionOpened">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "PositionOpened",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "PositionOpened">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"Transfer"`.
 */
export function useAaveTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "Transfer">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "Transfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"WhitelistAccessFlagWasToggled"`.
 */
export function useAaveWhitelistAccessFlagWasToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "WhitelistAccessFlagWasToggled">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "WhitelistAccessFlagWasToggled",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "WhitelistAccessFlagWasToggled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link aaveABI}__ and `eventName` set to `"WhitelistedStatusWasChanged"`.
 */
export function useAaveWhitelistedStatusWasChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof aaveABI, "WhitelistedStatusWasChanged">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: aaveABI,
    address: aaveAddress,
    eventName: "WhitelistedStatusWasChanged",
    ...config,
  } as UseContractEventConfig<typeof aaveABI, "WhitelistedStatusWasChanged">);
}
