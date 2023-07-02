import { Box, Heading } from "@chakra-ui/react";
import classNames from "classnames";
import { type FC } from "react";

import { type PropsWithClassName } from "@/types/components.types";
import { body, heading as headingTypo } from "@/utils/fonts";

interface PageWrapperProps extends PropsWithClassName {
  heading?: string;
  textAlign?: "left" | "center" | "right"; // default is 'center'
  className?: string;
}

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  heading,
  className,
  textAlign,
}) => (
  <Box
    className={`container p-3 sm:p-0 md:p-1 mx-auto font-sans mt-20 flex flex-col gap-7 items-center w-full ${body.variable} ${headingTypo.variable} ${className}`}
  >
    {heading != null && (
      <Heading
        as="h1"
        size="h1"
        className={`mb-2 ${textAlign === "left" && "self-start"} ${
          textAlign === "right" && "self-end"
        }`}
      >
        {heading}
      </Heading>
    )}
    {children}
  </Box>
);

export default PageWrapper;
