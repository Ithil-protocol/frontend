export default [{
  inputs: [
    {
      components: [
        {
          components: [
            {
              components: [
                {
                  internalType: "address",
                  name: "token",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "margin",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "interestAndSpread",
                  type: "uint256",
                },
              ],
              internalType: "struct IService.Loan[]",
              name: "loans",
              type: "tuple[]",
            },
            {
              components: [
                {
                  internalType: "enum IService.ItemType",
                  name: "itemType",
                  type: "uint8",
                },
                {
                  internalType: "address",
                  name: "token",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "identifier",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              internalType: "struct IService.Collateral[]",
              name: "collaterals",
              type: "tuple[]",
            },
            {
              internalType: "uint256",
              name: "createdAt",
              type: "uint256",
            },
            {
              internalType: "enum IService.Status",
              name: "status",
              type: "uint8",
            },
          ],
          internalType: "struct IService.Agreement",
          name: "agreement",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      internalType: "struct IService.Order",
      name: "order",
      type: "tuple",
    },
  ],
  name: "open",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
}],