/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

import {
  CloseDialogFn,
  OpenDialogFnOptions,
  OpenNotificationDialogFn,
} from "@/types";

const NotificationDialog = createContext<{
  openDialog: OpenNotificationDialogFn;
  closeDialog: CloseDialogFn;
}>({
  closeDialog: () => {},
  openDialog: (_o: OpenDialogFnOptions) => {},
});

export default NotificationDialog;
