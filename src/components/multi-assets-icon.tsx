import classNames from "classnames";
import { type FC } from "react";

import { type PropsWithClassName } from "@/types/components.types";

import TokenIcon from "./TokenIcon";

export interface MultiAssetsIconsProps extends PropsWithClassName {
  assets: string[];
}

// supports maximum of 8 assets
export const MultiAssetsIcons: FC<MultiAssetsIconsProps> = ({
  assets,
  className,
}) => {
  const containerClasses = "relative flex";
  // tailwind needs extractable classes to be in the same file
  const offsets = [
    "",
    "right-2",
    "right-4",
    "right-6",
    "right-8",
    "right-10",
    "right-12",
    "right-14",
    "right-16",
  ];
  const zIndexes = [
    "z-0",
    "z-1",
    "z-2",
    "z-3",
    "z-4",
    "z-5",
    "z-6",
    "z-7",
    "z-8",
  ];
  const width = [
    "",
    "w-[32px]",
    "w-[56px]",
    "w-[80px]",
    "w-[104px]",
    "w-[128px]",
    "w-[152px]",
    "w-[176px]",
    "w-[200px]",
  ];

  return (
    <div
      className={classNames(containerClasses, width[assets.length], className)}
    >
      {assets.map((asset, idx) => (
        <TokenIcon
          name={asset}
          key={`${asset}-${idx}`}
          className={classNames("relative", zIndexes[idx], offsets[idx], {
            "w-[32px] h-[32px]": idx === 0,
            "bg-primary-100 rounded-full ring-4 ring-primary-100 w-[32px] h-[32px]":
              idx > 0,
          })}
        />
      ))}
    </div>
  );
};
