import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Circle } from "phosphor-react";
import { type FC } from "react";

import {
  About as AboutIcon,
  Discord as DiscordIcon,
  Docs as DocsIcon,
  MagicMarker as MagicMarkerIcon,
  Source as SourceIcon,
  ThreeDot as ThreeDotIcon,
} from "@/assets/svgs";
import { mode } from "@/utils/theme";

import { ThemeSwitch } from "./theme-switch";

export type PageNames = "lend" | "dashboard" | "faucets" | "services";
interface NavigationPage {
  name: PageNames;
  url: string;
}

const pages: NavigationPage[] = [
  { name: "lend", url: "/lend" },
  { name: "services", url: "/services" },
  { name: "dashboard", url: "/dashboard" },
];

const Navbar: FC = () => {
  const { pathname } = useRouter();
  const { colorMode } = useColorMode();

  return (
    <nav>
      <div className="flex items-center w-full px-12 my-5">
        <div className="flex flex-grow gap-6">
          <a href="/">
            <div className="hidden sm:block">
              <Image
                src={`/assets/ithil/logoFull${
                  colorMode === "dark" ? "Dark" : "Light"
                }.svg`}
                height={32}
                width={120}
                alt="Ithil logo"
                priority
              />
            </div>
            <div className="block sm:hidden gap-x-2">
              <Image
                src={`/assets/ithil/logoSymbol${
                  colorMode === "dark" ? "Dark" : "Light"
                }.svg`}
                height={32}
                width={32}
                alt="Ithil logo"
                priority
              />
            </div>
          </a>
          <div className="hidden sm:block">
            <ThemeSwitch />
          </div>
          <div className="flex-grow hidden sm:flex">
            <div className="flex gap-2 justify-items-start">
              {pages.map(({ name, url }) => (
                <Link
                  key={name}
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
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            justifyContent: "space-between",
          }}
        >
          <ConnectButton chainStatus="full" />

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
              {[
                {
                  Icon: AboutIcon,
                  link: "https://ithil.fi",
                  title: "About",
                },
                {
                  link: "https://docs.ithil.fi",
                  title: "Docs",
                  Icon: DocsIcon,
                },
                {
                  link: "https://github.com/Ithil-protocol",
                  title: "Source",
                  Icon: SourceIcon,
                },
                {
                  Icon: DiscordIcon,
                  link: "https://discord.com/invite/tEaGBcGdQC",
                  title: "Discord",
                },
              ].map((item) => (
                <>
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
                </>
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
                  <span style={{ padding: "5px" }}>
                    <MagicMarkerIcon width={24} height={24} />
                  </span>
                  <span>Tutorial</span>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
