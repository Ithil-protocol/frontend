import { Heading as DefaultHeading } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  heading: string;
}
const Heading: FC<Props> = ({ heading }) => {
  return (
    <DefaultHeading as="h1" size="h1" className={"mb-2 "}>
      {heading}
    </DefaultHeading>
  );
};

export default Heading;
