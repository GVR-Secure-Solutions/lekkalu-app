import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Button } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'
import { router, useLocalSearchParams } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button/back-button'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '@/components/keyboard-scroll-view/keyboard-scroll-view'
import { AddComparisonSchema, addComparisonSchema } from '@/schema/comparisons'
import InputFields from '@/components/input-fields/input-fields'
import { COMPARISON_INPUT } from '@/utils/comparisons'
import { createComparison } from '@/queries/scenario'
import { COMPARISON } from '@/utils/query-keys/scenarios'

const AddComparison = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const qc = useQueryClient()
  const isEdit: boolean = !!params?.edit

  const defaultFormValues = {
    name: isEdit ? '' : undefined,
    access: isEdit ? '' : undefined,
    scenarios: isEdit ? [] : undefined,
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addComparisonSchema),
    defaultValues: defaultFormValues,
  })

  const { mutate: addComparison } = useMutation({
    mutationFn: createComparison,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPARISON.COMPARISON] })
      router.replace('/(authenticated)/comparisons/')
    },
  })

  const handleFormSubmitButton = (values: AddComparisonSchema) => {
    addComparison(values)
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg={'$backgroundHover'}>
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/comparisons')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {isEdit ? 'Edit Comparison' : 'Add Comparison'}
        </Text>
      </View>
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <InputFields control={control} errors={errors} inputs={COMPARISON_INPUT} />
        <View borderColor={'red'} borderWidth="1" borderStyle="solid">
          <Text fontSize={FontSizes.size16} mt={10} color={'gray'}>
            Scenarios in this comparison
          </Text>
        </View>
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          onPress={handleSubmit(handleFormSubmitButton)}
          bg={'$primary'}
          color={'white'}
          mt={hp(2)}
          mb={hp(5)}
        >
          {isEdit ? 'Edit Comparison' : 'Create Comparison'}
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default AddComparison

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
