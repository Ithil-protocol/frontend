import { useToast } from '@chakra-ui/react'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { type SendTransactionResult } from '@wagmi/core'
import { waitForTransaction } from '@wagmi/core'

export const useTransactionFeedback = () => {
  const addRecentTransaction = useAddRecentTransaction()
  const toast = useToast()

  const trackTransaction = async (
    txResult: SendTransactionResult | undefined,
    description: string,
    pastTenseDescription?: string,
  ) => {
    if (txResult === undefined) return
    addRecentTransaction({
      hash: txResult.hash,
      description: pastTenseDescription ?? description,
    })
    const toastId = toast({
      title: description,
      status: 'loading',
      duration: 30_000,
      isClosable: true,
    })

    await waitForTransaction({ hash: txResult.hash })
    toast.update(toastId, { title: description, status: 'success', duration: 5000, isClosable: true })
  }

  return { trackTransaction }
}
