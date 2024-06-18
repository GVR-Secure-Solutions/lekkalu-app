import React, { useEffect } from 'react'
import { Button, Text, View } from 'tamagui'
import { Modal } from 'native-base'
import { useNavigation } from 'expo-router'
import { UseFormReturn } from 'react-hook-form'
import { useColorScheme } from 'react-native'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '../../keyboard-scroll-view'
import InputFields from '../../input-fields'
import { InputField } from '@/types/input-fields'

type EntityForScenarioType = {
  isEdit?: boolean
  inputs: InputField[]
  entityName: string
  form: UseFormReturn<any>
  mutation: any
  isLoading: boolean
  handleComplete: () => void
}

const AddEditEntityForScenario = ({
  form,
  isEdit = false,
  inputs,
  entityName,
  mutation,
  isLoading,
  handleComplete,
}: EntityForScenarioType) => {
  const navigation = useNavigation()

  const systemTheme = useColorScheme()
  const background = systemTheme === 'dark' ? 'black' : 'white'
  const textColor = systemTheme === 'dark' ? 'white' : 'black'

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      form.reset()
    })
    return () => {
      unsubscribe()
    }
  }, [navigation, form.reset])

  return (
    <Modal avoidKeyboard isOpen={true} onClose={handleComplete} size={'full'}>
      <Modal.Content style={{ backgroundColor: background }}>
        <Modal.CloseButton />
        <Modal.Body>
          <View f={1} style={{ paddingHorizontal: wp(10), marginTop: hp(3) }}>
            <View fd="row" ai="center" columnGap={wp(4)} mb={wp(5)}>
              <Text fontSize={FontSizes.size20} fontFamily={'$heading'} color={textColor}>
                {entityName}
              </Text>
            </View>
            <KeyboardScrollView>
              <View rowGap={hp(1)}>
                <InputFields control={form.control} errors={form.formState.errors} inputs={inputs} />
              </View>
              <Button
                fontSize={FontSizes.size18}
                h={hp(5.5)}
                onPress={mutation}
                bg="$primary"
                color="white"
                mt={hp(4)}
                disabled={isLoading || !form.formState.isDirty}
              >
                {isEdit ? `Edit ${entityName}` : `Add ${entityName}`}
              </Button>
            </KeyboardScrollView>
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default AddEditEntityForScenario
