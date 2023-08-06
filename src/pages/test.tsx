/* eslint-disable unused-imports/no-unused-vars */
import { Button } from "@chakra-ui/react";
import {
  Address,
  erc20ABI,
  useAccount,
  useBalance,
  useContractWrite,
} from "wagmi";

import { assetsObjByAddress } from "@/data/assets";
import {
  useAaveLatestAndBase,
  useAaveRiskSpreads,
} from "@/hooks/generated/aave";
import { getAssetByName } from "@/utils";

const Test = () => {
  // Encodes a string, number, bigint, or ByteArray into a hex string
  // console.log("toHex", toHex(""));

  // vault data
  // const { data } = useVaultDetails("wbtc");
  // console.log("useVaultDetails", data);

  // this order is useless (and not working.don't know why). but I don't remove it for future test
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

  // this order works fine. if you want to test "open" function. (token, collateralToken, amount, _leverage)
  // const { order: workedOrder } = usePrepareDebitOrder(
  //   "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  //   "0x078f358208685046a11C85e8ad32895DED33A249",
  //   parseUnits("0.000241", 8),
  //   2
  // );

  // I don't know what is it
  // const { config, error: err } = usePrepareContractWrite({
  // mode
  // });
  // const { write, error } = useContractWrite({
  //   mode:"prepared",
  //   request:{
  //     abi: aaveABI,
  //     address: aaveAddress[98745],
  //     functionName: "open",
  //     args: [workedOrder],
  //     gas: 2000000n,
  //     account:"0xed7E824e52858de72208c5b9834c18273Ebb9D3b",
  //     chain:undefined
  //   }
  // });

  // this is for downloading events. it doesn't work I don't know why

  // const yy = async () => {
  //   const filter = await publicClient.createContractEventFilter({
  //     abi: aaveABI,
  //     // address: "0x19b9192455351473E3833B3D3BEAd3fFF09c460B",
  //     eventName: "PositionOpened",
  //     fromBlock: 0n,
  //   });
  //   const logs = await publicClient.getFilterLogs({ filter });
  //   console.log("event999", logs);
  // };

  // const { data: serviceAgreements, isLoading } = useAaveAgreements({
  //   args: [5n],
  // });

  // const { data: totalSupply } = useAaveTotalSupply();
  // const { data: tokenByIndex } = useAaveTokenByIndex({
  //   args: [0n],
  // });

  // const { data: agreement } = useAaveGetAgreement({
  //   args: [1n],
  // });

  // const { open, closed } = useAavePositions();

  // const { data: walletClient, error: walletError } = useWalletClient();
  // const { data: xx } = useContractRead({
  //   abi: aaveABI,
  //   address: aaveAddress[98745],
  //   functionName: "getUserAgreements",
  //   account: walletClient,
  // });

  // const { address: accountAddress } = useAccount();
  // const getData = async () => {
  //   console.log("useragg", walletError);

  //   if (walletClient) {
  //     console.log("useragg", 2);
  //     const contract = getContract({
  //       abi: aaveABI,
  //       address: aaveAddress[98745],
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
  // const { data: useragg } = useAaveGetUserAgreements({
  //   account: accountAddress,
  // });

  // const { data: getAgreementsByUser } = useGetAgreementsByUser();
  // console.log("useragg", reverseDisplayInterestSpreadInPercent(useragg[2].loans[0].interestAndSpread));

  // console.log("getAgreementsByUser", getAgreementsByUser);
  // console.log("ccccccc closed", closed);
  // console.log("totalSupply", totalSupply);
  // console.log("tokenByIndex", tokenByIndex);
  // console.log("agreement33", agreement);

  // this is for closing an agreement
  // const {
  //   write: close,
  //   error,
  //   data: txData,
  // } = useContractWrite({
  //   mode: "prepared",
  //   // @ts-ignore
  //   request: {
  //     abi: aaveABI,
  //     address: aaveAddress[98745],
  //     functionName: "close",
  //     args: [
  //       BigInt(0),
  //       encodeAbiParameters(parseAbiParameters("uint256"), [62437n]),
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
  //       abi: aaveABI,
  //       address: aaveAddress[98745],
  //       functionName: "getAgreement",
  //       args: [4n],
  //     },
  //   ],
  // });

  // console.log("xx", xx?.[0].result);

  // to see quote
  // const { data: zz } = useContractReads({
  //   contracts: [
  //     {
  //       abi: aaveABI,
  //       address: aaveAddress[98745],
  //       functionName: "quote",
  //       args: [getAgreementsByUser?.[0]?.[0] as unknown as ServiceAgreement],
  //       // enabled: getAgreementsByUser?.[0]?.[0],
  //     },
  //   ],
  // });
  // console.log("zz", zz);

  // useOpenPositions();
  // const { data: closePositions, isLoading } = useClosePositions();
  // console.log("closePositions data", closePositions);
  // console.log("closePositions isLoading", isLoading);

  // const { data: pp } = useAaveComputeDueFees({
  //   args: [getAgreementsByUser?.[0]?.[0] as unknown as ServiceAgreement],
  // });

  // console.log("pppp22",pp)

  // useRateAndSpread({tokenAddress:"0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"});

  // const { write: setRiskParam } = useContractWrite({
  //   mode: "prepared",
  //   // @ts-ignore
  //   request: {
  //     abi: aaveABI,
  //     address: aaveAddress[98745],
  //     functionName: "setRiskParams",
  //     args: [
  //       "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  //       BigInt(3e15),
  //       BigInt(1e16),
  //       BigInt(3 * 86400),
  //     ],
  //   },
  // });

  // const {data:ss} = useGetAgreementsByUser();
  // console.log("ssss", ss);

  // return <p onClick={() => close?.()}>download event </p>;

  // return (
  //   <Button disabled={!!write} onClick={() => write?.()}>
  //     write
  //   </Button>
  // );

  // return <p>{formatUnits(undefined,4)}</p>

  // const collateralToken = getContract({
  //   address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  //   abi: erc4626ABI,
  // });
  // const d = collateralToken.read.balanceOf([
  //   "0x8d55C13ac69f01E8ea0d616aB798265D4DF72544",
  // ]);
  // d.then((e) => console.log("collateralToken33", e));

  const { isLoading: isApproveLoading, write: approve } = useContractWrite({
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" as Address,
    abi: erc20ABI,
    functionName: "approve",
    args: ["0xDB338034fE951cDFEdd0A1abAab43e5C1Efd0bCd", 1000n],
    // onMutate: () => {
    //   notificationDialog.openLoading(`Approving ${inputAmount} ${token.name}`)
    // },
    // onSuccess: async ({ hash }) => {
    //   try {
    //     await waitForTransaction({
    //       hash,
    //     });
    //     notificationDialog.openSuccess(`Approved ${inputAmount} ${token.name}`)
    //     refetchAllowance();
    //   } catch (error) {
    //     notificationDialog.openError(error,"Failed")
    //   }
    // },
    // onError: (error) => notificationDialog.openError(error)
  });
  // const { data } = useCallOptionCurrentPrice();
  // const { data: ttl, isSuccess } = useCallOptionTotalAllocation();
  // data && console.log("virtualAmount", formatUnits(data, 6), ttl);

  // function callOptionFinalAmount(initialPrice: bigint, allocation: bigint) {
  //   const loan = 150000000n;
  //   const monthsLocked = 12;

  //   const virtualAmount =
  //     multiplyBigInt(loan, 2 ** (monthsLocked / 12)) / initialPrice;

  //   const finalPrice =
  //     (initialPrice * allocation) / (allocation - virtualAmount);

  //   const finalAmount =
  //     multiplyBigInt(loan, 2 ** (monthsLocked / 12)) / finalPrice;

  //   console.log("virtualAmount", finalAmount);
  // }

  // (data && isSuccess) && callOptionFinalAmount(data, ttl)

  // const { data: caps } = useManagerCaps({
  //   args: [
  //     "0xCcDf09d5C8AD392549F8AB5C2948b9007F9C2d6B",
  //     "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  //   ],
  // });
  // const { data: vaults } = useManagerVaults({
  //   args: ["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"],
  // });

  console.log("assets33", assetsObjByAddress);

  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
    token: "0x32a78c6F3bD1D4D1A50830529d1339ce081EDf28",
  });

  const { data: balanceUSDT } = useBalance({
    address,
    token: getAssetByName("usdt")?.tokenAddress,
  });

  console.log(
    "ITHIL",
    balance?.formatted.split(".")[0],
    "USDT",
    balanceUSDT?.formatted.split(".")[0]
  );
  console.log("balance33 balanceUSDT", balanceUSDT?.formatted);

  const { data: B } = useAaveLatestAndBase({
    args: ["0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"],
  });

  const { data: C } = useAaveRiskSpreads({
    args: ["0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"],
  });

  console.log("BBBBBBBB", B, "CCCCCCCCCCCC", C);

  if (B) {
    console.log("pppppppppppppp", B % BigInt(2) ** BigInt(128));
  }

  return (
    <Button onClick={() => approve()}>
      {isApproveLoading ? "approving..." : "approve"}
    </Button>
  );
};

export default Test;
