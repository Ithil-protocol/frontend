import { Heading } from "@chakra-ui/react";
import classNames from "classnames";
import { type FC } from "react";

import { type PropsWithClassName } from "@/types/components.types";
import { body, heading as headingTypo } from "@/utils/fonts";

interface PageWrapperProps extends PropsWithClassName {
  heading?: string;
  textAlign?: "left" | "center" | "right"; // default is 'center'
}

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  heading,
  className,
  textAlign,
}) => (
  <main
    className={classNames([
      "container p-3 sm:p-0 md:p-1 mx-auto font-sans",
      body.variable,
      headingTypo.variable,
      className,
    ])}
  >
    <div className="flex flex-col items-center w-full">
      {heading != null && (
        <Heading
          as="h1"
          size="h1"
          className={classNames(
            {
              "self-start": textAlign === "left",
              "self-end": textAlign === "right",
            },
            " mb-2"
          )}
        >
          {heading}
        </Heading>
      )}

      {children}
    </div>
  </main>
);

export default PageWrapper;
