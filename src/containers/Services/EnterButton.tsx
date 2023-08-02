import { Button } from "@chakra-ui/react";

import { VoidNoArgs } from "@/types";

interface Props {
  onClick?: VoidNoArgs;
}

const EnterButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button onClick={onClick} size="lg" className="w-full">
      Enter
    </Button>
  );
};

export default EnterButton;
