import { type FC } from "react";

import { type LendingToken } from "@/types/onchain.types";

import LendingDeposit from "./LendingDeposit";
import LendingWithdraw from "./LendingWithdraw";

interface LendingProps {
  token: LendingToken;
}

export const Deposit: FC<LendingProps> = ({ token }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 lg:px-16 xl:px-24 md:flex-row">
      <LendingDeposit token={token} />
      <LendingWithdraw token={token} />
    </div>
  );
};

export default Deposit;
