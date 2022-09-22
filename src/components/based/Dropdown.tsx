/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { Portal } from 'react-portal';
import { Placement } from '@popperjs/core';

interface IDropdown {
  action: ReactNode;
  menu: ReactNode;
  visible: boolean;
  onChange: (_visible: boolean) => void;
  placement?: Placement;
}

const Dropdown: FC<IDropdown> = ({
  action,
  menu,
  visible,
  onChange,
  placement = 'bottom-end',
}) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
  });

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [action, menu]);

  return (
    <>
      <div tw="flex flex-wrap">
        <div tw="relative inline-flex align-middle w-full">
          <div
            tw="p-0 m-0"
            ref={setReferenceElement as any}
            onClick={() => onChange(!visible)}
            onMouseLeave={() => onChange(false)}
          >
            {action}
          </div>
          <Portal>
            <div
              tw="pt-2 z-index[999]"
              ref={setPopperElement as any}
              style={styles.popper}
              {...attributes.popper}
              css={[
                visible
                  ? tw`opacity-100 pointer-events-auto`
                  : tw`opacity-0 pointer-events-none`,
              ]}
              onMouseLeave={() => onChange(false)}
              onMouseEnter={() => onChange(true)}
            >
              {menu}
            </div>
          </Portal>
        </div>
      </div>
    </>
  );
};

export default Dropdown;
