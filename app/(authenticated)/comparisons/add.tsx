import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { View, Text, Button } from 'tamagui'
import { FlatList } from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'
import { router, useLocalSearchParams } from 'expo-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { hp, wp } from '@/utils/responsive'
import Scenario from '@/components/comparisons/ScenarioInComparison/InAddScreen'
import BackButton from '@/components/back-button/back-button'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '@/components/keyboard-scroll-view/keyboard-scroll-view'
import { AddComparisonSchema, addComparisonSchema } from '@/schema/comparisons'
import InputFields from '@/components/input-fields/input-fields'
import { COMPARISON_INPUT } from '@/utils/comparisons'
import { createComparison, fetchComparisonById, fetchScenarios, updateComparison } from '@/queries/scenario'
import { COMPARISON, SCENARIO } from '@/utils/query-keys/scenarios'
import { Comparison, Scenario as ScenarioType } from '@/types/scenarios'
import ScenarioDialogInComparison from '@/components/comparisons/ScenarioDialog'

const AddComparison = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const qc = useQueryClient()
  const isEdit: boolean = !!params?.isEdit
  const comparisonId = +params.id

  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false)

  const {
    data: comparison,
    isSuccess: fetchedComparisonByIdSuccessfully,
    isLoading,
  } = useQuery({
    queryKey: [`${COMPARISON.COMPARISON}-${comparisonId}`],
    queryFn: () => fetchComparisonById(comparisonId),
    staleTime: 0,
    enabled: isEdit,
  })

  const defaultFormValues: AddComparisonSchema = {
    name: isEdit ? comparison?.name || '' : '',
    access: isEdit ? comparison?.access : 'Public',
    scenarios: isEdit ? comparison?.scenarios || [] : [],
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddComparisonSchema>({
    resolver: zodResolver(addComparisonSchema),
    values: defaultFormValues,
  })

  const { mutate: addComparison } = useMutation({
    mutationFn: createComparison,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPARISON.COMPARISON] })
      router.replace('/(authenticated)/comparisons/')
    },
  })

  const { mutate: editComparison } = useMutation({
    mutationFn: (value: Partial<Comparison>) => updateComparison(comparisonId, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPARISON.COMPARISON] })
      router.replace('/(authenticated)/comparisons')
    },
  })

  const { data: allScenarios } = useQuery({
    queryKey: [SCENARIO.SCENARIO],
    queryFn: fetchScenarios,
  })

  const [scenariosInThisComparison, setScenariosInThisComparison] = useState<Array<ScenarioType>>([])

  useEffect(() => {
    if (fetchedComparisonByIdSuccessfully) {
      setScenariosInThisComparison(comparison?.scenarios_objects)
    }
  }, [comparison, fetchedComparisonByIdSuccessfully])

  const handleFormSubmitButton = (values: AddComparisonSchema) => {
    const _values = {
      ...values,
      scenarios: scenariosInThisComparison?.map((each) => each?.id),
    }
    if (isEdit) {
      editComparison(_values)
    } else {
      addComparison(_values)
    }
  }

  const removeScenarioFromThisComparison = (id: number) => {
    const _filterdScenario = scenariosInThisComparison.filter((each) => each?.id !== id)
    setScenariosInThisComparison(_filterdScenario)
  }

  const scenariosAvailableToAdd = useMemo(() => {
    const alreadyAddedScenarioIds = scenariosInThisComparison.map((each) => each?.id)
    return allScenarios?.filter((each) => !alreadyAddedScenarioIds.includes(each?.id))
  }, [scenariosInThisComparison, allScenarios])

  const handleAddScenarioToComparison = (scenarios: ScenarioType[]) => {
    setScenariosInThisComparison([...scenariosInThisComparison, ...scenarios])
    setIsScenarioModalOpen(false)
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg={'$backgroundHover'}>
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/comparisons')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {isEdit ? 'Edit Comparison' : 'Add Comparison'}
        </Text>
      </View>
      {isEdit && isLoading ? (
        <></>
      ) : (
        <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
          <InputFields control={control} errors={errors} inputs={COMPARISON_INPUT} />
          <View fd={'row'} justifyContent="space-between">
            <Text fontSize={FontSizes.size16} mt={10} color={'gray'}>
              Scenarios in this comparison
            </Text>
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => setIsScenarioModalOpen(true)}>
              <Text color={'$blue10'}>Add</Text>
            </TouchableOpacity>
          </View>
          <View f={1} backgroundColor={'$background'} borderRadius={'$3'}>
            <FlatList
              contentContainerStyle={{ gap: 20, padding: 20 }}
              data={scenariosInThisComparison}
              ListEmptyComponent={() => {
                if (isEdit && isLoading) {
                  return (
                    <View>
                      <Text>Loading...</Text>
                    </View>
                  )
                }

                return (
                  <View>
                    <Text>No scenarios in this component</Text>
                  </View>
                )
              }}
              renderItem={({ item }) => (
                <Scenario
                  id={item?.id}
                  name={item?.name}
                  handleRemove={removeScenarioFromThisComparison}
                  access={item?.access}
                />
              )}
            />
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
      )}
      <ScenarioDialogInComparison
        data={scenariosAvailableToAdd || []}
        isModalOpen={isScenarioModalOpen}
        handleAdd={handleAddScenarioToComparison}
        handleModalClose={() => setIsScenarioModalOpen(false)}
      />
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
