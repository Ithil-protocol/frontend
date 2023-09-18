import { type FC } from "react";

import { Asset } from "@/types";

import LendingDeposit from "./LendingDeposit";
import LendingWithdraw from "./LendingWithdraw";

interface LendingProps {
  token: Asset;
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
