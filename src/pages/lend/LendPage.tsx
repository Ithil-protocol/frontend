import { FC, PropsWithChildren } from 'react'
import Page from 'src/components/based/Page'
import classNames from 'classnames'

interface PropsWithClassName extends PropsWithChildren {
  className?: string
}

const Wrapper: FC<PropsWithClassName> = ({ children, className }) => (
  <div
    className={classNames([
      'mb-4 gap-3',
      'flex justify-center self-start whitespace-nowrap',
      'text-secondary',
      'mobile:w-full mobile:flex-col mobile:items-start',
      'tablet:flex-row tablet:items-center tablet:[width:initial]',
      className,
    ])}
  >
    {children}
  </div>
)

const LendPage: FC = () => {
  return (
    <Page heading="Lend">
      <Wrapper>Hello World</Wrapper>
    </Page>
  )
}

export default LendPage
