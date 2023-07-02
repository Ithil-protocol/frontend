import Generic from "cryptocurrency-icons/svg/icon/generic.svg";
import {
  isSameDay,
  isWithinInterval,
  parse,
  startOfToday,
  subDays,
  subWeeks,
} from "date-fns";

import {
  About as AboutIcon,
  Discord as DiscordIcon,
  Docs as DocsIcon,
  Source as SourceIcon,
} from "@/assets/svgs";
import { icons } from "@/config/icons";

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

export type PageName = "lend" | "dashboard" | "faucets" | "services";

interface NavigationPage {
  name: PageName;
  url: string;
}
export const routes: NavigationPage[] = [
  { name: "lend", url: "/lend" },
  { name: "services", url: "/services" },
  { name: "dashboard", url: "/dashboard" },
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
