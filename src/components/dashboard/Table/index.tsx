import {
  Table as DefaultTable,
  TableContainer,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FC } from "react";

import { ColumnsActive } from "@/containers/DashboardPage";

interface Props {
  columns: ColumnsActive[];
}

const Table: FC<Props> = ({ columns }) => {
  return (
    <TableContainer width="full">
      <DefaultTable variant="unstyled">
        <Thead>
          <Tr>
            {columns.map((col, index) => (
              <Th key={col + index}>{col}</Th>
            ))}
          </Tr>
        </Thead>
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
