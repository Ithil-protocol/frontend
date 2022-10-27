/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, ReactNode } from 'react';

import Txt from '@/components/based/Txt';
import Container from '@/components/based/Container';

interface IPage {
  heading: string;
  description?: string;
  children: ReactNode;
}

const Page: FC<IPage> = ({ heading, description, children }) => {
  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-2">{heading}</Txt.Heading1>
          {description && (
            <Txt.Body1Regular tw="mb-12">{description}</Txt.Body1Regular>
          )}
          {children}
        </div>
      </div>
    </Container>
  );
};

export default Page;
