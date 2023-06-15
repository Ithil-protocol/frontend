/** @jsxImportSource @emotion/react */
// import { List } from 'phosphor-react'
import { useState } from "react";

// import MobileMenuModal from './MobileMenuModal'

export default function MobileMenu() {
  const [, setModalOpened] = useState(false);

  return (
    <>
      {/* <MobileMenuModal open={modalOpened} onClose={() => setModalOpened(false)} /> */}
      <div
        id="menu"
        className="relative flex items-center justify-center px-2 border-none rounded-md cursor-pointer h-9 tablet:h-10 desktop:h-11 w-9 tablet:w-10 desktop:w-11 bg-primary-200 hover:bg-hover-light dark:hover:bg-hover-dark"
        onClick={() => setModalOpened(true)}
      >
        {/* <List tw="text-secondary" size={24} /> */}
      </div>
    </>
  );
}
