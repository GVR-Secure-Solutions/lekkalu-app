import React, { useMemo, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { View, Text } from 'tamagui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FlatList } from 'native-base'
import { router, useLocalSearchParams } from 'expo-router'
import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button/back-button'
import { COMPARISON, SCENARIO } from '@/utils/query-keys/scenarios'
import { fetchComparisonById, fetchScenarios, updateComparison } from '@/queries/scenario'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import EditDeleteMenu from '@/components/edit-delete-menu/edit-delete-menu'
import ScenarioDialogInComparison from '@/components/comparisons/ScenarioDialog'
import { Scenario } from '@/types/scenarios'
import { AddComparisonSchema } from '@/schema/comparisons'

const ComparisonWithId = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const comparisonId = +params.id
  const [isAddScenarioModalOpen, setIsAddScenarioModalOpen] = useState(false)

  const { data: comparison, refetch: refetchComparison } = useQuery({
    queryKey: [`${COMPARISON.COMPARISON}-${comparisonId}`],
    queryFn: () => fetchComparisonById(comparisonId),
    staleTime: 0,
  })

  const { mutate: editComparison } = useMutation({
    mutationFn: (dto: Partial<AddComparisonSchema>) => updateComparison(comparisonId, dto),
    onSuccess: () => {
      refetchComparison()
      setIsAddScenarioModalOpen(false)
    },
  })

  const { data: allScenarios } = useQuery({
    queryKey: [SCENARIO.SCENARIO],
    queryFn: fetchScenarios,
  })

  const scenariosForAddDialog = useMemo(() => {
    const alreadyAddedScenariosIds = comparison?.scenarios_objects.map((each) => each?.id)
    return allScenarios?.filter((each) => !alreadyAddedScenariosIds?.includes(each?.id))
  }, [allScenarios, comparison])

  const handleAddScenarioToThisComparison = (scenarios: Array<Scenario>) => {
    const incommingScenariosIds = scenarios?.map((each) => each?.id)
    const existingScenariosIds = comparison?.scenarios || []
    const updatedScenarios = [...existingScenariosIds, ...incommingScenariosIds]
    editComparison({ scenarios: updatedScenarios })
  }

  const handleRemoveScenarioFromThisComparison = (id: number) => {
    const updatedScenarios = comparison?.scenarios.filter((each) => each !== id)
    editComparison({ scenarios: updatedScenarios })
  }

  return (
    <>
      <View f={1} pt={insets.top + hp(2)} bg={'$backgroundHover'}>
        <View fd="row" ml={wp(5)} mr={wp(14)}>
          <View fd={'row'} columnGap={wp(4)}>
            <BackButton onPress={() => router.replace('/(authenticated)/comparisons')} />
            <Text fontSize={FontSizes.size15} fontFamily={'$heading'} w={'90%'}>
              {comparison?.name}
            </Text>
          </View>
        </View>
        <View ml={wp(5)} mr={wp(5)} mt={20} backgroundColor={'$background'} br={'$5'} p="$4">
          <View fd="row" alignItems="center" jc={'space-between'}>
            <Text fontSize={'$5'} color={'$foreground'}>
              Scenarios in this comparison
            </Text>
            <TouchableOpacity onPress={() => setIsAddScenarioModalOpen(true)}>
              <Text color={'$blue10'}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={{ marginTop: 20, maxHeight: 120 }}
            contentContainerStyle={{ gap: 20, height: 100, paddingRight: 50 }}
            data={comparison?.scenarios_objects}
            horizontal
            showsHorizontalScrollIndicator
            ListEmptyComponent={() => {
              return (
                <View>
                  <Text>No scenarios found on this comparison</Text>
                </View>
              )
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: 150,
                  borderColor: THEME_COLORS.gray[500],
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  router.push({
                    pathname: `/(authenticated)/scenarios/${item?.id}`,
                    params: { id: item?.id },
                  })
                }}
              >
                <Text>{item?.name}</Text>
                <EditDeleteMenu
                  deleteMessage="Are you sure you want to remove this scenario from this comparison."
                  onDelete={() => handleRemoveScenarioFromThisComparison(item?.id)}
                  onEdit={() => {
                    router.push({
                      pathname: '/(authenticated)/scenarios/add',
                      params: { scenarioDetails: JSON.stringify(item), edit: 'true' },
                    })
                  }}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <View bg={'$background'} mx={'$5'} my={'$5'} p={'$4'}>
          <Text color={'gray'}>Graph here</Text>
        </View>
      </View>
      <ScenarioDialogInComparison
        data={scenariosForAddDialog || []}
        handleAdd={handleAddScenarioToThisComparison}
        handleModalClose={() => setIsAddScenarioModalOpen(false)}
        isModalOpen={isAddScenarioModalOpen}
      />
    </>
  )
}

export default ComparisonWithId
