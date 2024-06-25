import React, { useEffect, useState } from 'react'
import { Dialog, View, Text, Button, Spinner } from 'tamagui'
import { TouchableOpacity } from 'react-native'
import { Lock, Unlock } from '@tamagui/lucide-icons'
import { FontSizes } from '@/utils/fonts'

type PrivacyButtonForScenarioType = {
  isPublic: boolean
  handleMutation: () => void
  isSuccess: boolean
  isLoading: boolean
  name: string
}

const PrivacyButtonForScenario = ({
  isPublic,
  handleMutation,
  isSuccess,
  isLoading,
  name = 'scenario',
}: PrivacyButtonForScenarioType) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const onPressYes = () => {
    handleMutation()
  }

  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false)
    }
  }, [isSuccess])

  return (
    <View>
      <TouchableOpacity onPress={() => setIsDialogOpen(true)}>{isPublic ? <Unlock /> : <Lock />}</TouchableOpacity>
      <Dialog open={isDialogOpen} onOpenChange={(value) => setIsDialogOpen(value)}>
        <Dialog.Portal key={'Privacy-dialog-portal'}>
          <Dialog.Overlay key={'overlay'} onPress={() => setIsDialogOpen(false)} />
          <Dialog.Content style={{ width: '90%' }} key={'Privacy-dialog-content'}>
            <Dialog.Title>
              <Text fontSize={FontSizes.size13}>
                {`Are you sure you want to make this ${name} ${isPublic ? 'private' : 'public'}`}?
              </Text>
            </Dialog.Title>
            <View mt={10}>
              <View fd="row" gap={20}>
                <Button onPress={onPressYes} flex={1}>
                  {isLoading ? <Spinner /> : 'Yes'}
                </Button>
                <Button flex={1} onPress={() => setIsDialogOpen(false)}>
                  No
                </Button>
              </View>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
}

export default PrivacyButtonForScenario
