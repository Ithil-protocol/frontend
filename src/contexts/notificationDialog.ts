/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

import { CloseDialogFn, OpenDialogFn, OpenDialogFnOptions } from "@/types";

const NotificationDialog = createContext<{
  openDialog: OpenDialogFn;
  closeDialog: CloseDialogFn;
}>({
  closeDialog: () => {},
  openDialog: (_o: OpenDialogFnOptions) => {},
});

export default NotificationDialog;
