// const mobileHiddenColumnClass = "hidden md:table-cell";
import { Box } from "@chakra-ui/react";
import { FC, useEffect } from "react";

import Heading from "@/components/Heading";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { handleProtocolAlert } from "@/utils";

import Table from "./Table";

const Lend: FC = () => {
  const notificationDialog = useNotificationDialog();

  useEffect(() => {
    const { message, shouldShowMessage } = handleProtocolAlert();

    if (shouldShowMessage) notificationDialog.openInfo(message);
  }, []);

  return (
    <Box className="flex flex-col items-start w-full p-5 mx-auto font-sans gap-7">
      <Heading heading="Lend" />
      <Table />
    </Box>
  );
};

export default Lend;
