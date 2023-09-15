import Generic from "cryptocurrency-icons/svg/icon/generic.svg";
import {
  format,
  isFuture,
  isSameDay,
  isWithinInterval,
  parse,
  startOfToday,
  subDays,
  subWeeks,
} from "date-fns";
import { formatUnits, parseUnits } from "viem";
import { Address } from "viem";

import {
  About as AboutIcon,
  Dashboard,
  Discord as DiscordIcon,
  Docs as DocsIcon,
  Services,
  Source as SourceIcon,
  Star as StarIcon,
} from "@/assets/svgs";
import { icons } from "@/config/icons";
import { assetsObjByAddress, assetsObjByName } from "@/data/assets";
import { servicesByName } from "@/data/services";
import { Asset, PageHeading, Service, ServiceName, VaultName } from "@/types";

export const getTokenIcon = (key: string) => {
  const icon = icons[key.toUpperCase() as keyof typeof icons];
  return icon || Generic;
};
export const filterDatesWithinPastWeek = (data: any) => {
  const currentDate = startOfToday();
  const oneWeekPast = subWeeks(currentDate, 1);

  const filteredData = data.filter((item: any) => {
    const itemDate = parse(item.date, "dd/MM", new Date());
    return itemDate >= oneWeekPast && itemDate <= currentDate;
  });

  return filteredData;
};

export const formatToken = (name: VaultName, value: bigint) => {
  try {
    const token = getAssetByName(name);
    if (!token) throw Error("Token isn't defined");
    const decimals = token.decimals;
    return formatUnits(value, decimals);
  } catch (error) {
    console.error(error);
  }
};
export const parseToken = (name: VaultName, value: number | string) => {
  try {
    const token = getAssetByName(name);
    if (!token) throw Error("Token isn't defined");
    const decimals = token.decimals;
    const val = typeof value === "string" ? value : value.toString();
    return parseUnits(val, decimals);
  } catch (error) {
    console.error(error);
  }
};
export const filterOneDayPastData = (data: any) => {
  const currentDate = startOfToday();
  const oneDayPast = subWeeks(currentDate, 1);

  const filteredData = data.filter((item: any) => {
    const itemDate = parse(item.date, "dd/MM", new Date());
    return isSameDay(itemDate, oneDayPast);
  });

  return filteredData;
};

export const isWithinIntervalDaysAgo = (
  array: { date: Date }[] | undefined,
  days: number
) => {
  if (!array) return;

  const today = new Date();
  const daysAgo = subDays(today, days);

  return array.filter((item) => {
    const itemDate = new Date(item.date);
    return isWithinInterval(itemDate, { start: daysAgo, end: today });
  });
};

export const routes = [
  { name: "lend", url: "/lend", Icon: StarIcon },
  { name: "services", url: "/services", Icon: Services },
  { name: "dashboard", url: "/dashboard", Icon: Dashboard },
];

export const socialMedia = [
  {
    Icon: AboutIcon,
    link: "https://ithil.fi",
    title: "About",
  },
  {
    link: "https://docs.ithil.fi",
    title: "Docs",
    Icon: DocsIcon,
  },
  {
    link: "https://github.com/Ithil-protocol",
    title: "Source",
    Icon: SourceIcon,
  },
  {
    Icon: DiscordIcon,
    link: "https://discord.com/invite/tEaGBcGdQC",
    title: "Discord",
  },
];

export const fixPrecision = (value: number, precision: number) => {
  value = value * Math.pow(10, precision);
  value = Math.round(value);
  value = value / Math.pow(10, precision);

  return value;
};

export const cutoffDecimals = (number: number, decimals: number) => {
  const factor = Math.pow(10, decimals);
  return Math.floor(number * factor) / factor;
};

export const convertToString = (num: number) => {
  // Convert to exponential notation
  const exponentialStr = num.toExponential();

  // Extract the exponent
  const exponent = parseInt(exponentialStr.split("e")[1]);

  // Convert the exponent to a positive integer, and add 1 to account for potential non-zero integer part
  const decimals = Math.abs(exponent);

  // Convert to fixed-point notation with the calculated decimals
  return num.toFixed(decimals);
};

export const countDecimals = (value: number) => {
  return value.toString().split(".")[1]?.length || 0;
};

export const multiplyBigInt = (bigNum: bigint, multiplier: number) => {
  // Determine the count of decimal places in the multiplier
  const decimals = countDecimals(multiplier);

  // If the multiplier is an integer
  if (decimals === 0) {
    return bigNum * BigInt(multiplier);
  }

  // Adjust the multiplier by shifting the decimal places and convert to a BigInt
  const bigMultiplier = BigInt(Math.floor(multiplier * 10 ** decimals));

  // Perform the multiplication and division
  const result = (bigNum * bigMultiplier) / BigInt(10 ** decimals);

  return result;
};

export const pageHeading: PageHeading[] = [
  {
    pathName: "lend",
    heading: "Lend",
  },
  {
    pathName: "services",
    heading: "Services",
  },
  {
    pathName: "dashboard",
    heading: "",
  },
];

export enum SafetyScoreValue {
  positive = "positive",
  neutral = "neutral",
  negative = "negative",
}

export type serviceType = "aave";

export const displayLeverage = (leverage: string) => {
  return (Number(leverage) + 1).toString();
};

export const toFullDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  const formatType = "dd/MM/yyyy";
  const formattedDate = format(date, formatType);
  return formattedDate;
};

export function convertArrayByKeyToOBJ<
  T extends Record<string | number | symbol, any>,
  K extends keyof T
>(options: T[], keyName: K): Record<T[K], T> {
  const obj = {} as Record<T[K], T>;
  options.forEach((option) => {
    const key = option[keyName];
    obj[key] = option;
  });
  return obj;
}

export const getAssetByName = (name: string): Asset | undefined => {
  const asset = assetsObjByName[name.toUpperCase()];
  return asset;
};

export const getAssetByAddress = (address: Address): Asset | undefined => {
  const asset = assetsObjByAddress[address];
  return asset;
};

export const getSingleQueryParam = (
  queryParam: string | string[] | undefined
): string => {
  if (typeof queryParam === "undefined") {
    return ""; // return empty string when queryParam is undefined
  } else if (Array.isArray(queryParam)) {
    return queryParam[0]; // ignore other query params
  } else {
    return queryParam;
  }
};

export const getServiceByName = (name: ServiceName): Service => {
  return servicesByName[name];
};

export const getServiceNames = () =>
  ["aave", "call-option", "fixed-yield", "gmx", "ithil-staking"] as const;

export const getMetaError = (error: any) =>
  (error as { shortMessage: string }).shortMessage;

export const isValidNumber = (str: string) => {
  const regex = /^\d*\.?\d*$/;
  return regex.test(str);
};

export const normalizeInputValue = (inputValue: string) => {
  return Number.isNaN(+inputValue) ? "0" : inputValue;
};

export const handleProtocolAlert = () => {
  const isMainNet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  const message =
    "the protocol has been deeply tested but is unaudited, use it at your own risk";

  const dataKey = "protocolAlert";

  const alert = JSON.parse(localStorage.getItem(dataKey) || "null");
  const now = Date.now();

  if (!alert || alert.expireTime < now) {
    const thirtyDaysInMS = 2_592_000_000;

    const newAlert = {
      expireTime: now + thirtyDaysInMS,
      message,
    };
    localStorage.setItem(dataKey, JSON.stringify(newAlert));

    return {
      message,
      shouldShowMessage: isMainNet && true,
    };
  }

  return {
    message,
    shouldShowMessage: isMainNet && false,
  };
};

export const isPositionActive = (
  serviceName: ServiceName,
  createdAt: number
) => {
  const { deadline } = getServiceByName(serviceName);
  const time = createdAt + deadline;

  if (serviceName === "call-option") console.log("time33", createdAt * 1000);

  const isActive = isFuture(time * 1000);

  return isActive;
};
