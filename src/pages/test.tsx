import { useContractRead } from "wagmi";

import { vaultABI } from "@/abi";
import { useVaultDetails } from "@/hooks/useVaultDetails";

const Test = () => {
  const { data } = useVaultDetails("usdt");

  console.log("data33", data);

  return null;
};

export default Test;
