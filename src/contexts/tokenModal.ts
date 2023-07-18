/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

import { CloseDialogFn, OpenTokenDialogFn, TokenModalOptions } from "@/types";

const TokenModal = createContext<{
  closeDialog: CloseDialogFn;
  onSelectToken: CloseDialogFn;
  openDialog: OpenTokenDialogFn;
  setOptions: (o: TokenModalOptions) => void;
}>({
  closeDialog: () => {},
  onSelectToken: () => {},
  openDialog: () => {},
  setOptions: () => {},
});

export default TokenModal;
