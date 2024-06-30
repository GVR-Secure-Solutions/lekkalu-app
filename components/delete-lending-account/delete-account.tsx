import { useRef, useState } from 'react'
import { EvilIcons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertDialog, Button, IconButton, useToast } from 'native-base'
import { Text, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { wp } from '@/utils/responsive'
import { deleteLendingAccount } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { Success } from '@/utils/toast'

type DeleteTransactionProps = {
  id: number
}

export default function DeleteLendingAccount({ id }: DeleteTransactionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef(null)
  const qc = useQueryClient()
  const theme = useTheme()
  const toast = useToast()

  const onClose = () => setIsOpen(false)

  const deleteAccountMutation = useMutation({
    mutationFn: deleteLendingAccount,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [LENDING.ACCOUNTS],
      })
      setIsOpen(false)
      toast.show({ render: () => Success('Account deleted successfully') })
    },
  })

  const handleDelete = () => {
    deleteAccountMutation.mutate(id)
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
              Delete Account
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body backgroundColor={theme.backgroundHover.get()}>
            <Text fontSize={FontSizes.size15} color={theme.foreground.get()} fontFamily={'$heading'}>
              Are you sure you want to delete this account ?
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer backgroundColor={theme.backgroundHover.get()}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
                isLoading={deleteAccountMutation.isPending}
                color={theme.backgroundFocus.get()}
              >
                <Text fontSize={FontSizes.size18} color={theme.foreground.get()} fontFamily={'$heading'}>
                  Cancel
                </Text>
              </Button>
              <Button colorScheme="danger" onPress={handleDelete} isLoading={deleteAccountMutation.isPending}>
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
