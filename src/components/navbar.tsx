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

//CLEANME: Move to icons
import {
  About as AboutIcon,
  Discord as DiscordIcon,
  Docs as DocsIcon,
  MagicMarker as MagicMarkerIcon,
  Source as SourceIcon,
  ThreeDot as ThreeDotIcon,
} from "@/assets/svgs";

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
            <div className=""></div>
            {/* <div className="laptop:hidden mobile:[display:initial]">hallo!</div> */}
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
            <MenuList>
              <Link href={"https://ithil.fi"} target="_blank">
                <MenuItem gap={2}>
                  <span>
                    <AboutIcon width={24} height={24} />
                  </span>
                  <span>About</span>
                </MenuItem>
              </Link>
              <Link href={"https://docs.ithil.fi"} target="_blank">
                <MenuItem gap={2}>
                  <span>
                    <DocsIcon width={24} height={24} />
                  </span>
                  <span>Docs</span>
                </MenuItem>
              </Link>
              <Link href={"https://github.com/Ithil-protocol"} target="_blank">
                <MenuItem gap={2}>
                  <span>
                    <SourceIcon width={24} height={24} />
                  </span>
                  <span>Source</span>
                </MenuItem>
              </Link>
              <Link
                href={"https://discord.com/invite/tEaGBcGdQC"}
                target="_blank"
              >
                <MenuItem gap={2}>
                  <span>
                    <DiscordIcon width={24} height={24} />
                  </span>
                  <span>Discord</span>
                </MenuItem>
              </Link>
              <MenuItem gap={2}>
                <span>
                  <MagicMarkerIcon width={24} height={24} />
                </span>
                <span>Tutorial</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
