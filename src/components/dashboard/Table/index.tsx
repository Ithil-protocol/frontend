import {
  Table as DefaultTable,
  TableContainer,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { FC } from "react";

import { ColumnsActive } from "@/containers/DashboardPage";
import { mode } from "@/utils/theme";

interface Props {
  columns: ColumnsActive[];
}

const Table: FC<Props> = ({ columns }) => {
  const { colorMode } = useColorMode();
  return (
    <TableContainer width="full">
      <DefaultTable variant="unstyled">
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
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
