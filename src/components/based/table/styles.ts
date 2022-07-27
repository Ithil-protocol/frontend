import tw from 'twin.macro';
import { css } from '@emotion/react';

export const tableContainerStyle = css`
  ${tw`mb-4 rounded-xl bg-primary-100 p-6`}
  .table {
    tr {
      ${tw`desktop:py-3`}
    }
    tr > th:first-of-type {
      ${tw`ml-6`}
    }
    tr > th:last-of-type {
      ${tw` mr-6 `}
    }

    tbody > tr:last-of-type {
      ${tw`rounded-b-xl`}
    }

    td {
      ${tw`self-center`}
    }
    td:first-of-type {
      ${tw`ml-6`}
    }
    td:last-of-type {
      ${tw`mr-6`}
    }
  }
`;

export const tdSkeletonStyle = css`
  ${tw`py-3 text-left font-normal`}
`;

export const thStyle = [
  css`
    ${tw`bg-primary-100 font-sans font-semibold text-primary-400 border-b-primary-300`}
  `,
];
