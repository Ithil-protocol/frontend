import { Skeleton } from '@chakra-ui/react'
import { type FC } from 'react'

export const Loading: FC<{ width?: number }> = ({ width = 16 }) => <Skeleton width={width} height={4} />
