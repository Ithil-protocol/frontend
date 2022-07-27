/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, MouseEventHandler, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'phosphor-react';

interface IPaginationButton {
  Icon?: any;
  text?: string;
  active: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  currentPage?: number;
}

const PaginationButton: FC<IPaginationButton> = ({
  Icon,
  text,
  active,
  onClick,
  currentPage,
}) => {
  return (
    <button
      css={[
        tw`border-none rounded-md cursor-pointer flex-row px-2.5 py-2.5 bg-primary-200 width[36px] height[36px] flex justify-center items-center mx-1 font-sans hover:bg-hover-light dark:hover:bg-hover-dark`,
        active &&
          tw`bg-action text-primary-100 font-bold dark:text-secondary-100 hover:bg-hover-action dark:hover:bg-hover-action`,
      ]}
      onClick={onClick}
    >
      {!!Icon && (
        <Icon
          css={[
            tw`text-secondary`,
            active && tw`text-primary-100`,
            currentPage == 0 && tw`bg-primary`, // text-font-200
          ]}
        />
      )}
      {!!text && text}
    </button>
  );
};

interface IDataTablePagination {
  currentPage: number;
  maxPage: number;
  setPage: (pageValue: number) => void;
}

const DataTablePagination: FC<IDataTablePagination> = ({
  currentPage,
  maxPage,
  setPage,
}) => {
  const createPaginationItems = useCallback(
    (currentPage: number, maxPage: number) => {
      const filterByPageCount = (pageNum: number) =>
        pageNum > 0 && pageNum <= maxPage;

      if (currentPage === 1) {
        return [1, 2, 3].filter(filterByPageCount);
      }
      if (currentPage === maxPage) {
        return [maxPage - 2, maxPage - 1, maxPage].filter(filterByPageCount);
      }
      return [currentPage - 1, currentPage, currentPage + 1];
    },
    []
  );

  const paginationItems = createPaginationItems(currentPage, maxPage);

  return (
    <div css={tw`text-secondary  flex justify-center items-center`}>
      <span
        tw="text-warning py-4"
        onClick={() => setPage(Math.max(1, currentPage - 1))}
      >
        <PaginationButton active={false} Icon={ArrowLeft} />
      </span>

      <div tw="flex flex-row items-center">
        {paginationItems.map((page, i) => {
          return (
            <React.Fragment key={`${i}-${page}`}>
              <div onClick={() => setPage(page)}>
                <PaginationButton
                  active={page === currentPage}
                  text={page.toString()}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <span
        tw="text-action py-4"
        onClick={() => setPage(Math.min(maxPage, currentPage + 1))}
      >
        <PaginationButton
          currentPage={currentPage}
          active={false}
          Icon={ArrowRight}
        />
      </span>
    </div>
  );
};

export default DataTablePagination;
