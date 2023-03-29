import { Heading } from '@chakra-ui/react'
import classNames from 'classnames'
import { Raleway } from 'next/font/google'
import { type FC } from 'react'

import { type PropsWithClassName } from '@/types/components.types'

interface PageWrapperProps extends PropsWithClassName {
  heading: string
}

const raleway = Raleway({ subsets: ['latin'], variable: '--font-inter' })

const PageWrapper: FC<PageWrapperProps> = ({ children, heading, className }) => (
  <main className={classNames(['container p-1 sm:p-0 mx-auto font-sans', raleway.variable, className])}>
    <div className="flex flex-col items-center w-full">
      <Heading as="h1" size="h1" className="mb-2">
        {heading}
      </Heading>

      {children}
    </div>
  </main>
)

export default PageWrapper
