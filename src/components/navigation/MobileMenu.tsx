/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useState } from 'react';
import { List } from 'phosphor-react';

import MobileMenuModal from './MobileMenuModal';

export default function MobileMenu() {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <MobileMenuModal
        open={modalOpened}
        onClose={() => setModalOpened(false)}
      />
      <div
        id="menu"
        css={[
          tw`border-none rounded-md cursor-pointer h-9 tablet:h-10 desktop:h-11 w-9 tablet:w-10 desktop:w-11 px-2 bg-primary-200 relative flex justify-center items-center hover:bg-hover-light dark:hover:bg-hover-dark`,
        ]}
        onClick={() => setModalOpened(true)}
      >
        <List tw="text-secondary" size={24} />
      </div>
    </>
  );
}
