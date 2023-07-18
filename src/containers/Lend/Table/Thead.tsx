import { Thead as DefaultThead, Text, Th, Tooltip, Tr } from "@chakra-ui/react";
import classNames from "classnames";

import ToolTipIcon from "@/assets/svgs/Tooltip.svg";

const Thead = ({ columns }: { columns: any[] }) => {
  return (
    <DefaultThead>
      <Tr>
        {columns.map((column) => (
          <Th
            key={column.key}
            className={classNames(["normal-case", column.className])}
          >
            <div className="flex items-center gap-2">
              <Tooltip
                label={column.tooltip}
                isDisabled={column.tooltip == null}
                closeDelay={500}
              >
                <Text
                  fontSize="18px"
                  className={classNames({
                    "cursor-help": column.tooltip,
                  })}
                >
                  {column.hideText !== true && column.text}
                  {column.tooltip && (
                    <ToolTipIcon
                      width={20}
                      height={20}
                      style={{
                        margin: "0px 0px 3px 5px",
                        display: "inline",
                      }}
                    />
                  )}
                </Text>
              </Tooltip>
            </div>
          </Th>
        ))}
      </Tr>
    </DefaultThead>
  );
};

export default Thead;
