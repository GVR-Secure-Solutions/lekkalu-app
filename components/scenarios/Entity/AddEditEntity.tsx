import React, { useEffect } from 'react'
import { Button, Text, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router'

import { UseFormReturn } from 'react-hook-form'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '../../keyboard-scroll-view'
import InputFields from '../../input-fields'
import { InputField } from '@/types/input-fields'
import { IAddEditIncomeExpenseSchema } from '@/schema/income-statement'

type EntityForScenarioType = {
  isEdit?: boolean
  inputs: InputField[]
  entityName: string
  form: UseFormReturn<IAddEditIncomeExpenseSchema>
  mutation: any
  isLoading: boolean
}

const AddEditEntityForScenario = ({
  form,
  isEdit = false,
  inputs,
  entityName,
  mutation,
  isLoading,
}: EntityForScenarioType) => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      form.reset()
    })
    return () => {
      unsubscribe()
    }
  }, [navigation, form.reset])

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {entityName}
        </Text>
      </View>
      <KeyboardScrollView style={{ paddingHorizontal: wp(5), marginTop: hp(3) }}>
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
          disabled={isLoading}
        >
          {isEdit ? `Edit ${entityName}` : `Add ${entityName}`}
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default AddEditEntityForScenario
