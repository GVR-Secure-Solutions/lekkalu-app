import { EvilIcons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertDialog, Button, IconButton } from 'native-base'
import { useRef, useState } from 'react'
import { router } from 'expo-router'
import { Text, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { wp } from '@/utils/responsive'
import { deleteLendingAccount, deleteLendingTransaction } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { Transaction } from '@/types/lending'
import { queryClient } from '@/utils/query-client'

type DeleteTransactionProps = {
  id: number
  transactions: Transaction[]
}

export default function DeleteTransaction({ id, transactions }: DeleteTransactionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef(null)
  const qc = useQueryClient()
  const theme = useTheme()

  const onClose = () => setIsOpen(false)

  const deleteLendingAccountMutation = useMutation({
    mutationFn: deleteLendingAccount,
    mutationKey: [LENDING.ACCOUNTS],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      router.push('/lending')
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteLendingTransaction,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [LENDING.TRANSACTIONS],
      })
      setIsOpen(false)
      if (transactions.length === 1) {
        deleteLendingAccountMutation.mutate(transactions[0].lending_account)
      }
    },
  })

  const handleDelete = () => {
    deleteTransactionMutation.mutate(id)
  }

  return (
    <>
      <IconButton
        size={wp(6)}
        variant="solid"
        colorScheme="danger"
        _icon={{
          as: EvilIcons,
          name: 'trash',
          size: 6,
        }}
        onPress={() => {
          setIsOpen(true)
        }}
      />

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />

          <AlertDialog.Header backgroundColor={theme.backgroundHover.get()}>
            <Text fontSize={FontSizes.size18} color={theme.foreground.get()} fontFamily={'$heading'}>
              Delete Transaction
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body backgroundColor={theme.backgroundHover.get()}>
            <Text fontSize={FontSizes.size15} color={theme.foreground.get()} fontFamily={'$heading'}>
              Are you sure you want to delete this transaction ?
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer backgroundColor={theme.backgroundHover.get()}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
                isLoading={deleteTransactionMutation.isPending}
                color={theme.backgroundFocus.get()}
              >
                <Text fontSize={FontSizes.size18} color={theme.foreground.get()} fontFamily={'$heading'}>
                  Cancel
                </Text>
              </Button>
              <Button colorScheme="danger" onPress={handleDelete} isLoading={deleteTransactionMutation.isPending}>
                <Text fontSize={FontSizes.size18} color={'white'} fontFamily={'$heading'}>
                  Delete
                </Text>
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}
