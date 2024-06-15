import React from 'react'
import { AlertDialog, Button, XStack, YStack } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { hp } from '@/utils/responsive'
import CustomAlertDialog from '../custom-alert-dialog'
import { useAuthContext } from '@/hooks/use-auth'

const DeleteAccountModal = ({ trigger }: { trigger: React.JSX.Element }) => {
    const { deleteAccountMutation } = useAuthContext()
    const isLoading = deleteAccountMutation.isPending

    return (
        <CustomAlertDialog trigger={trigger}>
            <YStack space>
                <AlertDialog.Title fontSize={FontSizes.size24}>Are you sure ?</AlertDialog.Title>
                <AlertDialog.Description fontSize={FontSizes.size18} lineHeight={hp(2.5)}>
                    Do you really want to delete your account? This process cannot be undone.
                </AlertDialog.Description>
                <XStack space="$3" justifyContent="flex-end">
                    <AlertDialog.Cancel asChild>
                        <Button disabled={isLoading} variant="outlined" h={hp(5)} fontSize={FontSizes.size16}>
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <Button
                            color="white"
                            onPress={() => deleteAccountMutation.mutate()}
                            bg="$red10Light"
                            h={hp(5)}
                            fontSize={FontSizes.size16}
                            theme="active"
                            disabled={isLoading}
                        >
                            Delete Account
                        </Button>
                    </AlertDialog.Action>
                </XStack>
            </YStack>
        </CustomAlertDialog>
    )
}

export default DeleteAccountModal
