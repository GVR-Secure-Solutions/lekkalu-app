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
import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'
import { getIncomeSouce } from '@/queries/income-statement'

const AddScenarios = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const isEdit: boolean = !!params?.edit

  const { data: assets } = useQuery({
    queryKey: [BALANCE_SHEET.ASSETS],
    queryFn: fetchPhysicalAssets,
    select(data) {
      return data.map((each) => ({ label: each?.name, value: each?.id }))
    },
  })

  const { data: liabilities } = useQuery({
    queryKey: [BALANCE_SHEET.LIABILITIES],
    queryFn: fetchLiabilities,
    select(data) {
      return data.map((each) => ({ label: each?.name, value: each?.id }))
    },
  })

  const { data: income } = useQuery({
    queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_SOURCE],
    queryFn: getIncomeSouce,
    select(data) {
      return data?.data?.map((each) => ({ label: each?.name, value: each?.id }))
    },
  })

  const {
    control,
    formState: { errors },
  } = useForm<AddScenarioSchemaType>({
    resolver: zodResolver(addScenarioSchema),
  })

  const addScenarioInputs = useMemo(
    () => getAddScenarioInputs(liabilities, assets, income),
    [assets, liabilities, income],
  )

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
          mb={hp(5)}
        >
          {isEdit ? 'Edit Scenario' : 'Create Scenario'}
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
