import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";
import { Circle } from "phosphor-react";
import { type FC, Fragment } from "react";

import LogoFullDark from "@/assets/ithil/logoFullDark.svg";
import LogoFullLight from "@/assets/ithil/logoFullLight.svg";
import LogoSymbolDark from "@/assets/ithil/logoSymbolDark.svg";
import LogoSymbolLight from "@/assets/ithil/logoSymbolLight.svg";
import {
  HamburgerMenu,
  MagicMarker as MagicMarkerIcon,
  ThreeDot as ThreeDotIcon,
} from "@/assets/svgs";
import { routes, socialMedia } from "@/utils";
import { mode } from "@/utils/theme";

import { ThemeSwitch } from "./theme-switch";

interface Props {
  onSetSidebarOpen: (open: boolean) => void;
}

const Navbar: FC<Props> = ({ onSetSidebarOpen }) => {
  const { pathname } = useRouter();
  const { colorMode } = useColorMode();

  const handleOpenSideBar = () => onSetSidebarOpen(true);

  return (
    <nav>
      <div className="flex items-center w-full px-12 my-5">
        <div className="flex flex-grow gap-6">
          <Link href="/lend">
            <div className="hidden sm:block">
              {colorMode === "dark" ? (
                <LogoFullDark width={120} />
              ) : (
                <LogoFullLight width={120} />
              )}
            </div>
            <div className="block sm:hidden gap-x-2">
              {colorMode === "dark" ? (
                <LogoSymbolDark width={32} />
              ) : (
                <LogoSymbolLight width={32} />
              )}
            </div>
          </Link>
          <div className="flex items-center gap-7">
            <div className="flex-grow hidden sm:flex">
              <div className="flex gap-7 justify-items-start">
                {routes.map(({ name, url }, index) => (
                  <Link
                    key={name + index}
                    href={url}
                    className="relative flex flex-col items-center"
                  >
                    <Text casing="capitalize">{name}</Text>
                    {pathname.split("/")[1] === url.split("/")[1] && (
                      <Circle className="absolute w-2 h-2 mt-2 rounded-full top-6 bg-secondary" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:block">
              <ThemeSwitch />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 5,
            justifyContent: "space-between",
          }}
        >
          <div className="w-full">
            <ConnectButton chainStatus="full" />
          </div>

          <div className="hidden sm:flex">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<ThreeDotIcon />}
                variant="solid"
              />
              <MenuList
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {socialMedia.map((item, index) => (
                  <Fragment key={index}>
                    <MenuItem
                      style={{
                        width: "95%",
                        border: "transparent",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                      _hover={{
                        backgroundColor: mode(
                          colorMode,
                          "primary.200",
                          "primary.200.dark"
                        ),
                      }}
                    >
                      <Link href={item.link} target="_blank">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ padding: "5px" }}>
                            <item.Icon width={24} height={24} />
                          </span>
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </MenuItem>
                  </Fragment>
                ))}

                <MenuItem
                  style={{
                    width: "95%",
                    border: "transparent",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  _hover={{
                    backgroundColor: mode(
                      colorMode,
                      "primary.200",
                      "primary.200.dark"
                    ),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "5px",
                      }}
                    >
                      <MagicMarkerIcon width={24} height={24} />
                    </span>
                    <span>Tutorial</span>
                  </div>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>

        <Box
          bg={mode(colorMode, "primary.200", "primary.200.dark")}
          style={{
            borderRadius: "50%",
            marginLeft: "10px",
            padding: "5px",
          }}
          className="sm:hidden"
          onClick={handleOpenSideBar}
        >
          <HamburgerMenu width={32} height={32} />
        </Box>
      </div>
    </nav>
  );
};

export default Navbar;
