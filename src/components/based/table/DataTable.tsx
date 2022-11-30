/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, Fragment, ReactNode, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import DataTablePagination from './DataTablePagination';
import { tableContainerStyle, tdSkeletonStyle } from './styles';

import Txt from 'src/components/based/Txt';

type TableHeadType = {
  id: string;
  content: string | ReactNode;
};

type TableDataType = {
  [headCell: string]: ReactNode | string;
};

export interface ITableRow {
  head: TableHeadType[];
  row: TableDataType;
  hoverable?: boolean;
  detailedContent?: ReactNode;
  onClick?: () => void;
}

const TableRow: FC<ITableRow> = ({
  head,
  row,
  hoverable,
  detailedContent,
  onClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        css={[
          tw`cursor-pointer bg-primary-100 transition-all [transition-duration:300ms] border-b-1 border-b-primary-300 last:border-b-0`,
          hoverable && tw`hover:bg-primary-200`,
          detailedContent &&
            tw`
            [&:nth-last-child(2)]:border-b-0
            `,
        ]}
        onClick={() => {
          if (detailedContent) {
            setExpanded(!expanded);
          } else if (hoverable && onClick) {
            onClick();
          }
        }}
      >
        {head.map((headCell) => {
          return (
            <td
              key={headCell.id}
              css={tw`py-4 cursor-pointer first:pl-4 last:pr-4`}
            >
              {row[headCell.id]}
            </td>
          );
        })}
      </tr>
      {!!detailedContent && (
        <tr style={{ display: !expanded ? 'none' : undefined }}>
          <td tw="bg-primary-100" colSpan={head.length}>
            {detailedContent}
          </td>
        </tr>
      )}
    </>
  );
};

interface IDataTable {
  head: TableHeadType[];
  data: TableDataType[];
  maxPage?: number;
  currentPage?: number;
  setPage?: (value: number) => void;
  loading: boolean;
  hoverable?: boolean;
  detailedRowContent?: ReactNode;
  onRowClick?: (rowIdx: number) => void;
  RowComponent?: any;
  overflow?: boolean;
}

const DataTable: FC<IDataTable> = ({
  data,
  head,
  maxPage = 1,
  currentPage = 1,
  setPage,
  loading,
  hoverable,
  detailedRowContent,
  onRowClick,
  RowComponent = TableRow,
  overflow = true,
}) => {
  return (
    <div tw="w-full overflow-x-auto">
      <div css={[tableContainerStyle, overflow ? tw`[min-width:780px]` : tw``]}>
        <table css={tw`w-full`} className="table">
          <thead>
            <tr>
              {head.map((headCell) => (
                <th
                  key={headCell.id}
                  align="left"
                  css={[
                    tw`bg-primary-100 font-sans font-semibold text-primary-400 border-b-1 border-b-primary-300 pb-4`,
                  ]}
                >
                  <Txt.Body2Regular tw="text-font-100">
                    {headCell.content}
                  </Txt.Body2Regular>
                </th>
              ))}
            </tr>
          </thead>

          {!data.length && !loading && (
            <tbody>
              <tr>
                <td colSpan={head.length}>
                  <div tw="w-full rounded-lg  flex-col h-64 bg-primary-100 flex justify-center items-center">
                    <Txt.Body1Regular>No data found.</Txt.Body1Regular>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
          {loading ? (
            <tbody>
              <tr>
                <td css={tdSkeletonStyle}>
                  <SkeletonTheme baseColor="#f2f4f7" highlightColor="#E5E9EE">
                    <Skeleton
                      count={1}
                      height={33}
                      inline={true}
                      borderRadius={0}
                      duration={1}
                      style={{}}
                    />
                  </SkeletonTheme>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.map((row, idx) => (
                <RowComponent
                  key={`${idx}${head[0].id}`}
                  head={head}
                  row={row}
                  hoverable={hoverable}
                  detailedContent={detailedRowContent}
                  onClick={() => onRowClick && onRowClick(idx)}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
      {maxPage > 1 && !!setPage && (
        <DataTablePagination
          maxPage={maxPage}
          currentPage={currentPage}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default DataTable;
