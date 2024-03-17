import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text, Button } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '@/components/keyboard-scroll-view/keyboard-scroll-view'
import { fetchLiabilities, fetchPhysicalAssets } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { getAddScenarioInputs } from '@/utils/scenarios'
import InputFields from '@/components/input-fields/input-fields'
import { AddScenarioSchemaType, addScenarioSchema } from '@/schema/scenarios'

const AddScenarios = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const isEdit: boolean = !!params?.edit

  const { data: assets } = useQuery({
    queryKey: [BALANCE_SHEET.ASSETS],
    queryFn: fetchPhysicalAssets,
  })

  const { data: liabilities } = useQuery({
    queryKey: [BALANCE_SHEET.LIABILITIES],
    queryFn: fetchLiabilities,
  })

  const {
    control,
    formState: { errors },
  } = useForm<AddScenarioSchemaType>({
    resolver: zodResolver(addScenarioSchema),
  })

  const addScenarioInputs = useMemo(() => getAddScenarioInputs(liabilities, assets), [assets, liabilities])

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/scenarios/')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {isEdit ? 'Edit scenario' : 'Create a new scenario'}
        </Text>
      </View>
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <InputFields control={control} errors={errors} inputs={addScenarioInputs} />
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          //   onPress={handleSubmit(handleAddGoal)}
          bg="$primary"
          color="white"
          mt={hp(2)}
        >
          {isEdit ? 'Edit Goal' : 'Create Goal'}
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default AddScenarios

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
