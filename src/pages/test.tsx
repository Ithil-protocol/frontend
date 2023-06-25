import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Hex } from "viem";
import { Address, useContractRead, useContractWrite } from "wagmi";

import { vaultABI } from "@/abi";
import { serviceABI } from "@/hooks/generated/service";
import { useVaultDetails } from "@/hooks/useVaultDetails";
import { serviceTest } from "@/wagmiTest/service";

const Test = () => {
  const { data } = useVaultDetails("wbtc");
  console.log(data);
  const order = {
    agreement: {
      collaterals: [
        {
          amount: 1400n,
          identifier: 10n,
          itemType: 0,
          token: "0x078f358208685046a11C85e8ad32895DED33A249" as Address,
        },
      ],
      createdAt: 0n,
      loans: [
        {
          amount: 100n,
          interestAndSpread: 0n,
          margin: 50n,
          token: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f" as Address,
        },
      ],
      status: 0,
    },
    data: "0x1456575" as Hex,
  };
  // console.log("data33", data);
  const { write, error } = useContractWrite({
    abi: serviceABI,
    args: [order],
    address: "0xBf35a6ec119710ADE3403202eDBF003a2b852AEc",
    functionName: "open",
    gas: 100000000n,
    gasPrice: 1000000000000000000n,
  });
  console.log(error);
  //   const [isClient,setIsClient] = useState(false);

  //   useEffect(()=>{
  //     setIsClient(true)
  //   })
  // if(!isClient) return null
  // serviceTest(order)
  // useEffect(()=>{
  //   write();
  // },[])
  // console.log(error);
  return <Button onClick={() => write()}>jhkhkjh</Button>;
};

export default Test;
