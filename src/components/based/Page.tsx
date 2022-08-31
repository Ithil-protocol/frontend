/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, ReactNode } from 'react';

import Txt from '@/components/based/Txt';
import Container from '@/components/based/Container';

interface IPage {
  heading: string;
  navigate?: string | undefined;
  children: ReactNode;
}

const Page: FC<IPage> = ({ heading, children }) => {
  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12">{heading}</Txt.Heading1>
          {children}
        </div>
      </div>
    </Container>
  );
};

export default Page;
