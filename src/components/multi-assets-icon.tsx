import classNames from 'classnames'
import Image from 'next/image'
import { type FC } from 'react'

// supports maximum of 8 assets
export const MultiAssetsIcons: FC<{ assets: string[] }> = ({ assets }) => {
  // tailwind needs extractable classes to be in the same file
  const offsets = ['', 'right-2', 'right-4', 'right-6', 'right-8', 'right-10', 'right-12', 'right-14', 'right-16']
  const zIndexes = ['z-0', 'z-1', 'z-2', 'z-3', 'z-4', 'z-5', 'z-6', 'z-7', 'z-8']

  return (
    <div className="relative flex">
      {assets.map((asset, idx) => (
        <Image
          src={`/assets/tokens/${asset}.svg`}
          alt={`${asset} icon`}
          height={32}
          width={32}
          key={asset}
          className={classNames('relative', zIndexes[idx], offsets[idx], {
            'rounded-full ring-offset-2 ring-offset-primary-100 ring-2 ring-primary-100': idx > 0,
          })}
        />
      ))}
    </div>
  )
}
