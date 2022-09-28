/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React from 'react';

import Txt from '@/components/based/Txt';

export default function MaintenancePage() {
  return (
    <div tw="w-full h-full flex flex-col items-center justify-center">
      <Txt.Heading1>Temporarily Down for Maintenance</Txt.Heading1>
      <Txt.Body1Regular>
        We are performing scheduled maintenance. We should be back online
        shortly.
      </Txt.Body1Regular>
    </div>
  );
}
