import { Box, Button, Text } from "@chakra-ui/react";
import Link from "next/link";

import { IthilWizard } from "@/assets/svgs";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

const Page404 = () => {
  const { mode } = useColorMode();

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "full",
      }}
    >
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
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
                palette.variants.primary.action,
                palette.variants.primary["action.dark"]
              )}
            >
              Back to Home!
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Page404;
