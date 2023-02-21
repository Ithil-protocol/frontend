/** @jsxImportSource @emotion/react */
import 'twin.macro'
import { useState } from 'react'

import WalletConnectionModal from './WalletConnectionModal'
import AccountModal from './AccountModal'
import NetworkAlertBar from './NetworkAlertBar'
import MobileMenu from './MobileMenu'

import { useTheme } from 'src/state/application/hooks'
import NavigationMenu from 'src/components/navigation/NavigationMenu'
import ThemeSwitch from 'src/components/navigation/ThemeSwitch'
import KebabMenu from 'src/components/navigation/KebabMenu'
import { ReactComponent as LogoFullLight } from 'src/assets/images/logoFullLight.svg'
import { ReactComponent as LogoFullDark } from 'src/assets/images/logoFullDark.svg'
import { ReactComponent as LogoSymbolLight } from 'src/assets/images/logoSymbolLight.svg'
import { ReactComponent as LogoSymbolDark } from 'src/assets/images/logoSymbolDark.svg'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork } from 'wagmi'
import { goerli } from 'wagmi/chains'

const Navbar = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const theme = useTheme()
  const [walletModalOpened, setWalletModalOpened] = useState(false)
  const [accountModalOpened, setAccountModalOpened] = useState(false)

  const wrongNetwork = chain != undefined && chain.id !== goerli.id

  return (
    <div tw="flex flex-col">
      {address && wrongNetwork && (
        <NetworkAlertBar content="Wrong network - Support only Goerli testnet." />
      )}
      <div tw="w-full px-5 desktop:w-[calc(100% - 9rem)] my-6 tablet:mx-auto flex flex-row items-center justify-between">
        <span tw="flex flex-row items-center mobile:flex-grow">
          <a href="/">
            <div tw="tablet:[display:initial] mobile:hidden">
              {theme === 'dark' ? <LogoFullDark /> : <LogoFullLight />}
            </div>
            <div tw="tablet:hidden mobile:[display:initial] mobile:flex mobile:gap-x-2">
              {theme === 'dark' ? <LogoSymbolDark /> : <LogoSymbolLight />}
            </div>
          </a>
          <span
            tw="laptop:static laptop:ml-24 laptop:mr-0 flex flex-row items-center laptop:justify-start mobile:flex-grow mobile:justify-end mobile:ml-0 mobile:mr-4 gap-x-4"
            id="navigation"
          >
            <div tw="mobile:hidden laptop:[display:initial]">
              <NavigationMenu />
            </div>
            <div tw="laptop:hidden mobile:[display:initial]">
              <MobileMenu />
            </div>
            <div tw="tablet:[display:initial] mobile:hidden">
              <ThemeSwitch />
            </div>
          </span>
        </span>
        <span tw="flex flex-row items-center gap-2" id="connector">
          <ConnectButton />
          <KebabMenu />
        </span>
        <WalletConnectionModal
          id="connect-modal"
          open={walletModalOpened}
          onClose={() => setWalletModalOpened(false)}
        />
        <AccountModal
          open={accountModalOpened}
          onClose={() => setAccountModalOpened(false)}
        />
      </div>
    </div>
  )
}

export default Navbar
