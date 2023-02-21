/** @jsxImportSource @emotion/react */
import tw from 'twin.macro'
import { FC, ReactNode } from 'react'
import { useSwitchNetwork } from 'wagmi'
import { goerli } from 'wagmi/chains'

interface INetworkAlertBar {
  content: string | ReactNode
}

const NetworkAlertBar: FC<INetworkAlertBar> = ({ content }) => {
  const { switchNetwork } = useSwitchNetwork()

  const handleSwitchNetwork = () => {
    switchNetwork?.(goerli.id)
  }

  return (
    <div tw="w-full [height:50px] bg-error text-white font-bold flex items-center justify-center">
      {content}
      <button
        onClick={handleSwitchNetwork}
        css={[
          tw`ml-3 rounded-lg py-1 px-3 border-1 border-white text-white bg-white-100 bg-opacity-10 hover:bg-white hover:text-error transition-all [transition-duration:200ms]`,
        ]}
      >
        Switch
      </button>
    </div>
  )
}

export default NetworkAlertBar
