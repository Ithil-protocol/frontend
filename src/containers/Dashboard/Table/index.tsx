import {
  Table as DefaultTable,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { FC } from "react";

import { viewTypes } from "@/types";
import { mode } from "@/utils/theme";

import TRow from "./TRow";

interface Props {
  columns: any[];
  activeView: viewTypes;
}

const Table: FC<Props> = ({ columns, activeView }) => {
  const { colorMode } = useColorMode();
  return (
    <TableContainer width="full">
      <DefaultTable
        className="border-separate border-spacing-y-3"
        variant="unstyled"
        width="full"
      >
        <Thead>
          <Tr>
            {columns.map((col, index) => (
              <Th
                color={mode(colorMode, "primary.700", "primary.700.dark")}
                className="font-sans"
                fontSize="18px"
                fontWeight="medium"
                key={col + index}
              >
                {col}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <TRow data="" activeView={activeView} />
          <TRow data="" activeView={activeView} />
          <TRow data="" activeView={activeView} />
          <TRow data="" activeView={activeView} />
          <TRow data="" activeView={activeView} />
        </Tbody>
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
