import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text, Button } from 'tamagui'
import { router, useLocalSearchParams } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { AxiosInstance } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '@/components/keyboard-scroll-view/keyboard-scroll-view'
import { getAddScenarioInputs } from '@/utils/scenarios'
import InputFields from '@/components/input-fields/input-fields'
import { AddScenarioSchemas, addScenarioSchemas } from '@/schema/scenarios'
import { createScenarios, editScenario as updateScenario } from '@/queries/scenario'
import { Scenario } from '@/types/scenarios'
import { queryClient } from '@/utils/query-client'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { loginImaginaryUser } from '@/queries/auth'
import { addGoalForImaginaryUser as addGoal } from '@/queries/goal'
import { useImaginaryAuth } from '@/hooks/use-imaginary-auth'

const ONE_YEAR_LATER = dayjs().add(1, 'year').toISOString().split('T')[0]

const AddScenarios = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const isEdit: boolean = !!params?.edit

  const { getAPIClientForImaginaryUser } = useImaginaryAuth()

  const { mutate: createGoalForImaginaryUser } = useMutation({
    mutationFn: (apiClient: AxiosInstance) =>
      addGoal(
        {
          name: `${Math.random()}-goal`,
          goal_proportionality: 'HigherTheBetter',
          track_kpi: 'NetWorth',
          target_value: 1,
          target_date: ONE_YEAR_LATER,
        },
        apiClient,
      ),
  })

  const { mutate: login } = useMutation({
    mutationFn: loginImaginaryUser,
  })

  const { mutate: addScenario } = useMutation({
    mutationFn: createScenarios,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SCENARIO.SCENARIO] })
      login(
        { username: data.imag_username, password: data.imag_password, id: data.id },
        {
          onSuccess: (loginInfo) => {
            const apiClient = getAPIClientForImaginaryUser(loginInfo.access, 'v2')
            createGoalForImaginaryUser(apiClient, {
              onSuccess: () => {
                router.push(`/(authenticated)/scenarios/${data.id}`)
              },
            })
          },
        },
      )
    },
  })

  const editScenarioDetail = params?.scenarioDetails ? JSON.parse(params?.scenarioDetails as any) : null

  const { mutate: editScenario } = useMutation({
    mutationFn: (values: Partial<Scenario>) => updateScenario(+editScenarioDetail?.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCENARIO.SCENARIO] })
      router.push('/(authenticated)/scenarios/')
    },
  })

  const defaultFormValues = {
    name: isEdit ? editScenarioDetail?.name : undefined,
    access: isEdit ? editScenarioDetail?.access : 'Public',
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddScenarioSchemas>({
    resolver: zodResolver(addScenarioSchemas),
    defaultValues: defaultFormValues,
  })

  const addScenarioInputs = useMemo(() => getAddScenarioInputs(), [])

  const handleScenarioFormSubmit = (values: AddScenarioSchemas) => {
    if (isEdit) {
      editScenario(values)
    } else {
      addScenario(values)
    }
  }

  const handleBack = () => {
    if (params.backToComparison) {
      router.push(`/(authenticated)/comparisons/${params.backToComparison}`)
    } else {
      router.push('/(authenticated)/scenarios/')
    }
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={handleBack} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {isEdit ? 'Edit scenario' : 'Create a new scenario'}
        </Text>
      </View>
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <InputFields control={control} errors={errors} inputs={addScenarioInputs} />
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          onPress={handleSubmit(handleScenarioFormSubmit)}
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
