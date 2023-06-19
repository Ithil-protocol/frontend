import Generic from "cryptocurrency-icons/svg/icon/generic.svg";
import {
  addDays,
  isAfter,
  isBefore,
  isSameDay,
  parse,
  startOfToday,
  subWeeks,
} from "date-fns";

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
