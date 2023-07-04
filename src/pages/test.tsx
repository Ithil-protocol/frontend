import { parseUnits, toHex } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { prepareOrder } from "@/containers/Services/service.contract";
import {
  serviceABI,
  useServiceAgreements,
  useServiceGetAgreement,
  useServiceGetUserAgreements,
  useServiceTokenByIndex,
  useServiceTotalSupply,
} from "@/hooks/generated/service";
import { useAavePositions } from "@/hooks/useAavePositions";
import { publicClient } from "@/wagmiTest/config";

const Test = () => {
  // Encodes a string, number, bigint, or ByteArray into a hex string
  console.log("toHex", toHex(""));

  // vault data
  // const { data } = useVaultDetails("wbtc");
  // console.log("useVaultDetails", data);

  // this order is usless (and not working.don't know why). but I dont remove it for future test
  // const order = {
  //   agreement: {
  //     collaterals: [
  //       {
  //         amount: BigInt(30000000),
  //         identifier: BigInt(0),
  //         itemType: 0,
  //         token: "0x078f358208685046a11C85e8ad32895DED33A249" as Address,
  //       },
  //     ],
  //     createdAt: BigInt(0),
  //     loans: [
  //       {
  //         amount: BigInt(20000000),
  //         interestAndSpread: BigInt(0),
  //         margin: BigInt(100000000),
  //         token: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f" as Address,
  //       },
  //     ],
  //     status: 0,
  //   },
  //   data: toHex(""),
  // };

  // this function simulate a contract write without calling it and return the output. (as the output of "open" is undefined it will return undefined)
  // serviceTest(order);

  // this order works fine. if you want to test "open" function. (token, aToken, amount, _leverage)
  const workedOrder = prepareOrder(
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    "0x078f358208685046a11C85e8ad32895DED33A249",
    parseUnits("0.000241", 8),
    2
  );

  // I don't know what is it
  // const { config, error: errr } = usePrepareContractWrite({
  // mode
  // });
  // const { write, error } = useContractWrite({
  //   mode:"prepared",
  //   request:{
  //     abi: serviceABI,
  //     address: serviceAddress[42161],
  //     functionName: "open",
  //     args: [workedOrder],
  //     gas: 2000000n,
  //     account:"0xed7E824e52858de72208c5b9834c18273Ebb9D3b",
  //     chain:undefined
  //   }
  // });

  // this is for downloading events. it doesn't work I dont know why

  const yy = async () => {
    const filter = await publicClient.createContractEventFilter({
      abi: serviceABI,
      // address: "0x19b9192455351473E3833B3D3BEAd3fFF09c460B",
      eventName: "PositionOpened",
      fromBlock: 0n,
    });
    const logs = await publicClient.getFilterLogs({ filter });
    console.log("event999", logs);
  };

  const { data: serviceAgreements, isLoading } = useServiceAgreements({
    args: [5n],
  });

  const { data: totalSupply } = useServiceTotalSupply();
  const { data: tokenByIndex } = useServiceTokenByIndex({
    args: [0n],
  });

  const { data: agreement } = useServiceGetAgreement({
    args: [1n],
  });

  const { open, closed } = useAavePositions();

  const { data: walletClient, error: walletError } = useWalletClient();
  // const { data: xx } = useContractRead({
  //   abi: serviceABI,
  //   address: serviceAddress[42161],
  //   functionName: "getUserAgreements",
  //   account: walletClient,
  // });

  const { address: accountAddress } = useAccount();
  // const getData = async () => {
  //   console.log("useragg", walletError);

  //   if (walletClient) {
  //     console.log("useragg", 2);
  //     const contract = getContract({
  //       abi: serviceABI,
  //       address: serviceAddress[42161],
  //       walletClient,
  //     });
  //     console.log("useragg", 3);
  //     const data = await contract.read.getUserAgreements({
  //       account: accountAddress,
  //     });
  //     console.log("useragg", data);
  //   }
  // };
  // getData();
  const { data: useragg } = useServiceGetUserAgreements({
    account: accountAddress,
  });
  console.log("useragg", useragg);

  console.log("ccccccc open", open);
  console.log("ccccccc closed", closed);
  console.log("totalSupply", totalSupply);
  console.log("tokenByIndex", tokenByIndex);
  console.log("agreement33", agreement);

  // this is for closing an agreement
  // const {
  //   write,
  //   error,
  //   data: txData,
  // } = useContractWrite({
  //   mode: "prepared",
  //   // @ts-ignore
  //   request: {
  //     abi: serviceABI,
  //     address: serviceAddress[42161],
  //     functionName: "close",
  //     args: [
  //       BigInt(4),
  //       encodeAbiParameters(parseAbiParameters("uint256"), [19980000n]),
  //     ],
  //     gas: 20000000n,
  //   },
  // });

  // // to see if transaction failed or succeed
  // const { data: tx, error: txError } = useWaitForTransaction({
  //   hash: txData?.hash,
  // });
  // console.log("tx", tx, txError);

  // // this function convert readable data to hex
  // console.log(
  //   "0099",
  //   encodeAbiParameters(parseAbiParameters("uint256"), [70000n])
  // );

  // // to see agreement data
  // const { data: xx } = useContractReads({
  //   contracts: [
  //     {
  //       abi: serviceABI,
  //       address: serviceAddress[42161],
  //       functionName: "getAgreement",
  //       args: [4n],
  //     },
  //   ],
  // });

  // console.log("xx", xx?.[0].result);

  // // to see quote
  // const { data: yy } = useContractReads({
  //   contracts: [
  //     {
  //       abi: serviceABI,
  //       address: serviceAddress[42161],
  //       functionName: "quote",
  //       args: [xx?.[0].result as unknown as ServiceAgreement],
  //     },
  //   ],
  // });
  // console.log("yy", yy);

  return <p onClick={yy}>download event </p>;

  // return (
  //   <Button disabled={!!write} onClick={() => write?.()}>
  //     write
  //   </Button>
  // );
};

export default Test;
