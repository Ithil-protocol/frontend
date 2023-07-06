import Generic from "cryptocurrency-icons/svg/icon/generic.svg";
import {
  isSameDay,
  isWithinInterval,
  parse,
  startOfToday,
  subDays,
  subWeeks,
} from "date-fns";
import { formatUnits, parseUnits } from "viem";

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
import vaults from "@/deploy/vaults.json";
import { VaultName, VaultsTypes } from "@/types";

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

export const getTokenByAddress = (tokenAddress: string): VaultsTypes => {
  const vault = vaults.find((item) => item.tokenAddress === tokenAddress);
  if (!vault) throw new Error("Vault not found");
  return vault;
};

export const getTokenByName = (name: VaultName): VaultsTypes | undefined => {
  return vaults.find((item) => item.name === name);
};

export const formatToken = (name: VaultName, value: bigint) => {
  try {
    const token = getTokenByName(name);
    console.log("token:::", token);
    if (!token) throw Error("Token isn't defined");
    const decimals = token.decimals;
    return formatUnits(value, decimals);
  } catch (error) {
    console.error(error);
  }
};
export const parseToken = (name: VaultName, value: number | string) => {
  try {
    const token = getTokenByName(name);
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
