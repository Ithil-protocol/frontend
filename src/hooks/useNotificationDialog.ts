import { useContext } from "react";

import NotificationDialog from "@/contexts/notificationDialog";

export const useNotificationDialog = () => {
  return useContext(NotificationDialog);
};
