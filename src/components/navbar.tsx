import { Text, useColorMode } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Circle } from 'phosphor-react'
import { type FC } from 'react'

// import NavigationMenu from 'src/components/navigation/NavigationMenu'
import { ThemeSwitch } from './theme-switch'

export type PageNames = 'lend' | 'dashboard' | 'faucets'
interface NavigationPage {
  name: PageNames
  url: string
}

const pages: NavigationPage[] = [{ name: 'lend', url: '/lend' }]

const Navbar: FC = () => {
  const { pathname } = useRouter()
  const { colorMode } = useColorMode()

  return (
    <nav>
      <div className="flex items-center w-full px-12 my-5">
        <div className="flex flex-grow gap-6">
          <a href="/">
            <div className="hidden sm:block">
              <Image
                src={`/assets/images/logoFull${colorMode === 'dark' ? 'Dark' : 'Light'}.svg`}
                height={32}
                width={120}
                alt="Ithil logo"
                priority
              />
            </div>
            <div className="block sm:hidden gap-x-2">
              <Image
                src={`/assets/images/logoSymbol${colorMode === 'dark' ? 'Dark' : 'Light'}.svg`}
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
            <div className="justify-items-start">
              {pages.map(({ name, url }) => (
                <Link key={name} href={url} className="relative flex flex-col items-center">
                  <Text casing="capitalize">{name}</Text>
                  {pathname === url && <Circle className="absolute w-2 h-2 mt-2 rounded-full top-6 bg-secondary" />}
                </Link>
              ))}
            </div>
            {/* <div className="mobile:hidden laptop:[display:initial]"><NavigationMenu /></div> */}
            {/* <div className="laptop:hidden mobile:[display:initial]">
              <MobileMenu />
            </div> */}
          </div>
        </div>
        <ConnectButton chainStatus={'full'} />
      </div>
    </nav>
  )
}

export default Navbar
