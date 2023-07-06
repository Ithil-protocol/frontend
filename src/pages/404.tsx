import { Box, Button, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";

import { IthilWizard } from "@/assets/svgs";
import { palette } from "@/styles/theme/palette";
import { mode } from "@/utils/theme";

const Page404 = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        style={{
          padding: "20px",
          borderRadius: "10px",
          width: "100%",
          display: "flex",
          maxWidth: "400px",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            fontSize: "28px",
          }}
        >
          Page not found!
        </Text>

        <IthilWizard width="100%" height="400px" />

        <Link style={{ width: "100%" }} href="/lend">
          <Button
            bg={mode(
              colorMode,
              palette.variants.primary.action,
              palette.variants.primary["action.dark"]
            )}
          >
            Back to Home!
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Page404;
