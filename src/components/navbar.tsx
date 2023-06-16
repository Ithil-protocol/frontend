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

import AboutIcon from "@/assets/svgs/About.svg";
import DiscordIcon from "@/assets/svgs/Discord.svg";
import DocsIcon from "@/assets/svgs/Docs.svg";
import MagicMarkerIcon from "@/assets/svgs/MagicMarker.svg";
import SourceIcon from "@/assets/svgs/Source.svg";
import ThreeDotIcon from "@/assets/svgs/ThreeDot.svg";

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
                <MenuItem icon={<AboutIcon />}>About</MenuItem>
              </Link>
              <Link href={"https://docs.ithil.fi"} target="_blank">
                <MenuItem icon={<DocsIcon />}>Docs</MenuItem>
              </Link>
              <Link href={"https://github.com/Ithil-protocol"} target="_blank">
                <MenuItem icon={<SourceIcon />}>Source</MenuItem>
              </Link>
              <Link
                href={"https://discord.com/invite/tEaGBcGdQC"}
                target="_blank"
              >
                <MenuItem icon={<DiscordIcon />}>Discord</MenuItem>
              </Link>
              {/* <Link href={"https://ithil.fi"} target="_blank"> */}
              <MenuItem icon={<MagicMarkerIcon />}>Tutorial</MenuItem>
              {/* </Link> */}
            </MenuList>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
