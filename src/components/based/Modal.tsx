/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, ReactNode } from 'react';
import ReactModal from 'react-modal';
import { X } from 'phosphor-react';

ReactModal.setAppElement('#root');

interface IModal {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<IModal> = ({ open, onClose, children }) => {
  return (
    <ReactModal
      tw="z-50 overflow-hidden w-screen h-screen bg-primary-100 top-1/2 left-1/2 marginRight[-50%] transform[translate(-50%, -50%)] flex flex-col justify-center items-center fixed desktop:rounded-xl p-4 desktop:min-width[400px] desktop:min-height[64px] desktop:max-width[50%]  desktop:w-auto desktop:h-auto pt-5"
      isOpen={open}
      closeTimeoutMS={200}
      onRequestClose={onClose}
      contentLabel=""
    >
      {children}
      <button
        css={[
          tw`border-none rounded-md cursor-pointer px-2.5 py-2.5 bg-primary-100 width[36px] height[36px] mx-1 absolute right-2 top-4`,
        ]}
        onClick={onClose}
      >
        <X tw="text-secondary dark:text-secondary-300" />
      </button>
    </ReactModal>
  );
};

export default Modal;
