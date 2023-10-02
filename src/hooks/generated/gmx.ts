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
// Gmx
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gmxABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "_manager", internalType: "address", type: "address" },
      { name: "_router", internalType: "address", type: "address" },
      { name: "_routerV2", internalType: "address", type: "address" },
      { name: "_deadline", internalType: "uint256", type: "uint256" },
    ],
  },
  { type: "error", inputs: [], name: "AboveRiskThreshold" },
  { type: "error", inputs: [], name: "InterestRateOverflow" },
  { type: "error", inputs: [], name: "InvalidInitParams" },
  { type: "error", inputs: [], name: "InvalidStatus" },
  { type: "error", inputs: [], name: "InvalidToken" },
  { type: "error", inputs: [], name: "Locked" },
  { type: "error", inputs: [], name: "LossByArbitraryAddress" },
  { type: "error", inputs: [], name: "MarginTooLow" },
  { type: "error", inputs: [], name: "OnlyLiquidator" },
  { type: "error", inputs: [], name: "RestrictedAccess" },
  { type: "error", inputs: [], name: "RestrictedToOwner" },
  { type: "error", inputs: [], name: "UserIsNotWhitelisted" },
  { type: "error", inputs: [], name: "ZeroGlpSupply" },
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
    name: "glp",
    outputs: [{ name: "", internalType: "contract IERC20", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "glpManager",
    outputs: [
      { name: "", internalType: "contract IGlpManager", type: "address" },
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
    name: "liquidator",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
    inputs: [],
    name: "rewardTracker",
    outputs: [
      { name: "", internalType: "contract IRewardTracker", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "riskSpreads",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "router",
    outputs: [
      { name: "", internalType: "contract IRewardRouter", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "routerV2",
    outputs: [
      { name: "", internalType: "contract IRewardRouterV2", type: "address" },
    ],
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
    inputs: [{ name: "_liquidator", internalType: "address", type: "address" }],
    name: "setLiquidator",
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
    inputs: [],
    name: "totalCollateral",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalRewards",
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
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalVirtualDeposits",
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
    name: "usdgVault",
    outputs: [
      { name: "", internalType: "contract IUsdgVault", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "virtualDeposit",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "weth",
    outputs: [{ name: "", internalType: "contract IERC20", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenID", internalType: "uint256", type: "uint256" }],
    name: "wethReward",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "whitelisted",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
] as const;

export const gmxAddress = "0xC6CAEE9a234268b4baCC65CeD6963b10Bb45350b" as const;

export const gmxConfig = { address: gmxAddress, abi: gmxABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__.
 */
export function useGmxRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"agreements"`.
 */
export function useGmxAgreements<
  TFunctionName extends "agreements",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "agreements",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useGmxBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"computeBaseRateAndSpread"`.
 */
export function useGmxComputeBaseRateAndSpread<
  TFunctionName extends "computeBaseRateAndSpread",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "computeBaseRateAndSpread",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"computeDueFees"`.
 */
export function useGmxComputeDueFees<
  TFunctionName extends "computeDueFees",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "computeDueFees",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"deadline"`.
 */
export function useGmxDeadline<
  TFunctionName extends "deadline",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "deadline",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"enabled"`.
 */
export function useGmxEnabled<
  TFunctionName extends "enabled",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "enabled",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"getAgreement"`.
 */
export function useGmxGetAgreement<
  TFunctionName extends "getAgreement",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "getAgreement",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"getApproved"`.
 */
export function useGmxGetApproved<
  TFunctionName extends "getApproved",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "getApproved",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"getUserAgreements"`.
 */
export function useGmxGetUserAgreements<
  TFunctionName extends "getUserAgreements",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "getUserAgreements",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"glp"`.
 */
export function useGmxGlp<
  TFunctionName extends "glp",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "glp",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"glpManager"`.
 */
export function useGmxGlpManager<
  TFunctionName extends "glpManager",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "glpManager",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"guardian"`.
 */
export function useGmxGuardian<
  TFunctionName extends "guardian",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "guardian",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"halvingTime"`.
 */
export function useGmxHalvingTime<
  TFunctionName extends "halvingTime",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "halvingTime",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"id"`.
 */
export function useGmxId<
  TFunctionName extends "id",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "id",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useGmxIsApprovedForAll<
  TFunctionName extends "isApprovedForAll",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "isApprovedForAll",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"latestAndBase"`.
 */
export function useGmxLatestAndBase<
  TFunctionName extends "latestAndBase",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "latestAndBase",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"liquidationScore"`.
 */
export function useGmxLiquidationScore<
  TFunctionName extends "liquidationScore",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "liquidationScore",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"liquidator"`.
 */
export function useGmxLiquidator<
  TFunctionName extends "liquidator",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "liquidator",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"locked"`.
 */
export function useGmxLocked<
  TFunctionName extends "locked",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "locked",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"manager"`.
 */
export function useGmxManager<
  TFunctionName extends "manager",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "manager",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"minMargin"`.
 */
export function useGmxMinMargin<
  TFunctionName extends "minMargin",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "minMargin",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"name"`.
 */
export function useGmxName<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"owner"`.
 */
export function useGmxOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useGmxOwnerOf<
  TFunctionName extends "ownerOf",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "ownerOf",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"quote"`.
 */
export function useGmxQuote<
  TFunctionName extends "quote",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "quote",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"rewardTracker"`.
 */
export function useGmxRewardTracker<
  TFunctionName extends "rewardTracker",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "rewardTracker",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"riskSpreads"`.
 */
export function useGmxRiskSpreads<
  TFunctionName extends "riskSpreads",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "riskSpreads",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"router"`.
 */
export function useGmxRouter<
  TFunctionName extends "router",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "router",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"routerV2"`.
 */
export function useGmxRouterV2<
  TFunctionName extends "routerV2",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "routerV2",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useGmxSupportsInterface<
  TFunctionName extends "supportsInterface",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "supportsInterface",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"symbol"`.
 */
export function useGmxSymbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"tokenByIndex"`.
 */
export function useGmxTokenByIndex<
  TFunctionName extends "tokenByIndex",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "tokenByIndex",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"tokenOfOwnerByIndex"`.
 */
export function useGmxTokenOfOwnerByIndex<
  TFunctionName extends "tokenOfOwnerByIndex",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "tokenOfOwnerByIndex",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useGmxTokenUri<
  TFunctionName extends "tokenURI",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "tokenURI",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"totalCollateral"`.
 */
export function useGmxTotalCollateral<
  TFunctionName extends "totalCollateral",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "totalCollateral",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"totalRewards"`.
 */
export function useGmxTotalRewards<
  TFunctionName extends "totalRewards",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "totalRewards",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useGmxTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"totalVirtualDeposits"`.
 */
export function useGmxTotalVirtualDeposits<
  TFunctionName extends "totalVirtualDeposits",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "totalVirtualDeposits",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"usdgVault"`.
 */
export function useGmxUsdgVault<
  TFunctionName extends "usdgVault",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "usdgVault",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"virtualDeposit"`.
 */
export function useGmxVirtualDeposit<
  TFunctionName extends "virtualDeposit",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "virtualDeposit",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"weth"`.
 */
export function useGmxWeth<
  TFunctionName extends "weth",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "weth",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"wethReward"`.
 */
export function useGmxWethReward<
  TFunctionName extends "wethReward",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "wethReward",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"whitelisted"`.
 */
export function useGmxWhitelisted<
  TFunctionName extends "whitelisted",
  TSelectData = ReadContractResult<typeof gmxABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "whitelisted",
    ...config,
  } as UseContractReadConfig<typeof gmxABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__.
 */
export function useGmxWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof gmxABI, string>["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof gmxABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, TFunctionName, TMode>({
    abi: gmxABI,
    address: gmxAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"addToWhitelist"`.
 */
export function useGmxAddToWhitelist<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "addToWhitelist"
        >["request"]["abi"],
        "addToWhitelist",
        TMode
      > & { functionName?: "addToWhitelist" }
    : UseContractWriteConfig<typeof gmxABI, "addToWhitelist", TMode> & {
        abi?: never;
        functionName?: "addToWhitelist";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "addToWhitelist", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "addToWhitelist",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"approve"`.
 */
export function useGmxApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof gmxABI, "approve">["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof gmxABI, "approve", TMode> & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "approve", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"close"`.
 */
export function useGmxClose<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof gmxABI, "close">["request"]["abi"],
        "close",
        TMode
      > & { functionName?: "close" }
    : UseContractWriteConfig<typeof gmxABI, "close", TMode> & {
        abi?: never;
        functionName?: "close";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "close", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "close",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"edit"`.
 */
export function useGmxEdit<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof gmxABI, "edit">["request"]["abi"],
        "edit",
        TMode
      > & { functionName?: "edit" }
    : UseContractWriteConfig<typeof gmxABI, "edit", TMode> & {
        abi?: never;
        functionName?: "edit";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "edit", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "edit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"open"`.
 */
export function useGmxOpen<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof gmxABI, "open">["request"]["abi"],
        "open",
        TMode
      > & { functionName?: "open" }
    : UseContractWriteConfig<typeof gmxABI, "open", TMode> & {
        abi?: never;
        functionName?: "open";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "open", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "open",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"removeFromWhitelist"`.
 */
export function useGmxRemoveFromWhitelist<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "removeFromWhitelist"
        >["request"]["abi"],
        "removeFromWhitelist",
        TMode
      > & { functionName?: "removeFromWhitelist" }
    : UseContractWriteConfig<typeof gmxABI, "removeFromWhitelist", TMode> & {
        abi?: never;
        functionName?: "removeFromWhitelist";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "removeFromWhitelist", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "removeFromWhitelist",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useGmxRenounceOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "renounceOwnership"
        >["request"]["abi"],
        "renounceOwnership",
        TMode
      > & { functionName?: "renounceOwnership" }
    : UseContractWriteConfig<typeof gmxABI, "renounceOwnership", TMode> & {
        abi?: never;
        functionName?: "renounceOwnership";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "renounceOwnership", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "renounceOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useGmxSafeTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "safeTransferFrom"
        >["request"]["abi"],
        "safeTransferFrom",
        TMode
      > & { functionName?: "safeTransferFrom" }
    : UseContractWriteConfig<typeof gmxABI, "safeTransferFrom", TMode> & {
        abi?: never;
        functionName?: "safeTransferFrom";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "safeTransferFrom", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "safeTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useGmxSetApprovalForAll<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "setApprovalForAll"
        >["request"]["abi"],
        "setApprovalForAll",
        TMode
      > & { functionName?: "setApprovalForAll" }
    : UseContractWriteConfig<typeof gmxABI, "setApprovalForAll", TMode> & {
        abi?: never;
        functionName?: "setApprovalForAll";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "setApprovalForAll", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setApprovalForAll",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setGuardian"`.
 */
export function useGmxSetGuardian<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "setGuardian"
        >["request"]["abi"],
        "setGuardian",
        TMode
      > & { functionName?: "setGuardian" }
    : UseContractWriteConfig<typeof gmxABI, "setGuardian", TMode> & {
        abi?: never;
        functionName?: "setGuardian";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "setGuardian", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setGuardian",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setLiquidator"`.
 */
export function useGmxSetLiquidator<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "setLiquidator"
        >["request"]["abi"],
        "setLiquidator",
        TMode
      > & { functionName?: "setLiquidator" }
    : UseContractWriteConfig<typeof gmxABI, "setLiquidator", TMode> & {
        abi?: never;
        functionName?: "setLiquidator";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "setLiquidator", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setLiquidator",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setMinMargin"`.
 */
export function useGmxSetMinMargin<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "setMinMargin"
        >["request"]["abi"],
        "setMinMargin",
        TMode
      > & { functionName?: "setMinMargin" }
    : UseContractWriteConfig<typeof gmxABI, "setMinMargin", TMode> & {
        abi?: never;
        functionName?: "setMinMargin";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "setMinMargin", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setMinMargin",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setRiskParams"`.
 */
export function useGmxSetRiskParams<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "setRiskParams"
        >["request"]["abi"],
        "setRiskParams",
        TMode
      > & { functionName?: "setRiskParams" }
    : UseContractWriteConfig<typeof gmxABI, "setRiskParams", TMode> & {
        abi?: never;
        functionName?: "setRiskParams";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "setRiskParams", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setRiskParams",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"toggleLock"`.
 */
export function useGmxToggleLock<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "toggleLock"
        >["request"]["abi"],
        "toggleLock",
        TMode
      > & { functionName?: "toggleLock" }
    : UseContractWriteConfig<typeof gmxABI, "toggleLock", TMode> & {
        abi?: never;
        functionName?: "toggleLock";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "toggleLock", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "toggleLock",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"toggleWhitelistFlag"`.
 */
export function useGmxToggleWhitelistFlag<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "toggleWhitelistFlag"
        >["request"]["abi"],
        "toggleWhitelistFlag",
        TMode
      > & { functionName?: "toggleWhitelistFlag" }
    : UseContractWriteConfig<typeof gmxABI, "toggleWhitelistFlag", TMode> & {
        abi?: never;
        functionName?: "toggleWhitelistFlag";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "toggleWhitelistFlag", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "toggleWhitelistFlag",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useGmxTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof gmxABI, "transferFrom", TMode> & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "transferFrom", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "transferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useGmxTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof gmxABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<typeof gmxABI, "transferOwnership", TMode> & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<typeof gmxABI, "transferOwnership", TMode>({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__.
 */
export function usePrepareGmxWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, TFunctionName>,
    "abi" | "address"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"addToWhitelist"`.
 */
export function usePrepareGmxAddToWhitelist(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "addToWhitelist">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "addToWhitelist",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "addToWhitelist">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareGmxApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "approve">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"close"`.
 */
export function usePrepareGmxClose(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "close">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "close",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "close">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"edit"`.
 */
export function usePrepareGmxEdit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "edit">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "edit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "edit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"open"`.
 */
export function usePrepareGmxOpen(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "open">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "open",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "open">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"removeFromWhitelist"`.
 */
export function usePrepareGmxRemoveFromWhitelist(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "removeFromWhitelist">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "removeFromWhitelist",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "removeFromWhitelist">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareGmxRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "renounceOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "renounceOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "renounceOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareGmxSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "safeTransferFrom">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "safeTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "safeTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareGmxSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "setApprovalForAll">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setApprovalForAll",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "setApprovalForAll">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setGuardian"`.
 */
export function usePrepareGmxSetGuardian(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "setGuardian">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setGuardian",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "setGuardian">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setLiquidator"`.
 */
export function usePrepareGmxSetLiquidator(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "setLiquidator">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setLiquidator",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "setLiquidator">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setMinMargin"`.
 */
export function usePrepareGmxSetMinMargin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "setMinMargin">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setMinMargin",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "setMinMargin">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"setRiskParams"`.
 */
export function usePrepareGmxSetRiskParams(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "setRiskParams">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "setRiskParams",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "setRiskParams">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"toggleLock"`.
 */
export function usePrepareGmxToggleLock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "toggleLock">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "toggleLock",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "toggleLock">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"toggleWhitelistFlag"`.
 */
export function usePrepareGmxToggleWhitelistFlag(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "toggleWhitelistFlag">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "toggleWhitelistFlag",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "toggleWhitelistFlag">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareGmxTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "transferFrom">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "transferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link gmxABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareGmxTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof gmxABI, "transferOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: gmxABI,
    address: gmxAddress,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof gmxABI, "transferOwnership">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__.
 */
export function useGmxEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, TEventName>,
    "abi" | "address"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    ...config,
  } as UseContractEventConfig<typeof gmxABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"Approval"`.
 */
export function useGmxApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "Approval">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useGmxApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "ApprovalForAll">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "ApprovalForAll",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "ApprovalForAll">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"BaseRiskSpreadWasUpdated"`.
 */
export function useGmxBaseRiskSpreadWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "BaseRiskSpreadWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "BaseRiskSpreadWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "BaseRiskSpreadWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"GuardianWasUpdated"`.
 */
export function useGmxGuardianWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "GuardianWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "GuardianWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "GuardianWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"LiquidationTriggered"`.
 */
export function useGmxLiquidationTriggeredEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "LiquidationTriggered">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "LiquidationTriggered",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "LiquidationTriggered">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"LockWasToggled"`.
 */
export function useGmxLockWasToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "LockWasToggled">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "LockWasToggled",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "LockWasToggled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useGmxOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "OwnershipTransferred">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"PositionClosed"`.
 */
export function useGmxPositionClosedEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "PositionClosed">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "PositionClosed",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "PositionClosed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"PositionOpened"`.
 */
export function useGmxPositionOpenedEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "PositionOpened">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "PositionOpened",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "PositionOpened">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"Transfer"`.
 */
export function useGmxTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "Transfer">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "Transfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"WhitelistAccessFlagWasToggled"`.
 */
export function useGmxWhitelistAccessFlagWasToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "WhitelistAccessFlagWasToggled">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "WhitelistAccessFlagWasToggled",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "WhitelistAccessFlagWasToggled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link gmxABI}__ and `eventName` set to `"WhitelistedStatusWasChanged"`.
 */
export function useGmxWhitelistedStatusWasChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof gmxABI, "WhitelistedStatusWasChanged">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: gmxABI,
    address: gmxAddress,
    eventName: "WhitelistedStatusWasChanged",
    ...config,
  } as UseContractEventConfig<typeof gmxABI, "WhitelistedStatusWasChanged">);
}
