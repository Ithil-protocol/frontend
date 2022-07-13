/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, ReactNode } from 'react';

interface IContainer {
  children: ReactNode;
}

const Container: FC<IContainer> = ({ children }) => {
  return (
    <div css={[tw`max-w-1920 w-[calc(100% - 3rem)] my-6 mx-auto`]}>
      {children}
    </div>
  );
};

export default Container;
