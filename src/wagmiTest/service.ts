import { Account, BaseError, ContractFunctionRevertedError } from "viem";

import { serviceABI } from "@/hooks/generated/service";

import { account, publicClient } from "./config";

interface Props {
  agreement: {
    loans: readonly {
      token: `0x${string}`;
      amount: bigint;
      margin: bigint;
      interestAndSpread: bigint;
    }[];
    collaterals: readonly {
      itemType: number;
      token: `0x${string}`;
      identifier: bigint;
      amount: bigint;
    }[];
    createdAt: bigint;
    status: number;
  };
  data: `0x${string}`;
}

export async function serviceTest(order: Props) {
  try {
    console.log("errrr1111");
    const data = await publicClient.simulateContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: serviceABI,
      functionName: "open",
      account: account,
      args: [order],
    });
    console.log("errrr2222222", data);
  } catch (err) {
    console.log("errrr3");
    if (err instanceof BaseError) {
      console.log("errrr4");
      // Option 1: checking the instance of the error
      if (err.cause instanceof ContractFunctionRevertedError) {
        const cause: ContractFunctionRevertedError = err.cause;
        const errorName = cause;
        // do something with `errorName`
        console.log("errrr", errorName);
      }

      // Option 2: using `walk` method from `BaseError`
      console.log("errrr5");
      const revertError = err.walk(
        (err) => err instanceof ContractFunctionRevertedError
      );
      if (revertError) {
        console.log("errrr6");
        const errorName = revertError;
        // do something with `errorName`
        console.log("errrr", errorName);
      }
    }
  }
}
