import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { View, Text } from 'tamagui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FlatList, Toast } from 'native-base'

import {
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { LineChart as LC } from 'echarts/charts'
import { SVGRenderer } from '@wuba/react-native-echarts'
import { router, useLocalSearchParams } from 'expo-router'
import * as echarts from 'echarts/core'

import dayjs from 'dayjs'
import { LineChart as LineChartIcon } from '@tamagui/lucide-icons'
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
import { tokenClient } from '@/utils/client'
import { useImaginaryAuth } from '@/hooks/use-imaginary-auth'
import { GoalItemType } from '@/queries/goal'
import { mergeArraysByDate } from '@/utils/comparison-timeline'
import LineChart from '@/components/LineChart'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { formatIndianMoneyNotation } from '@/utils/fn'

echarts.use([SVGRenderer, GridComponent, LegendComponent, DataZoomComponent, TooltipComponent, ToolboxComponent, LC])

const ComparisonWithId = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const comparisonId = +params.id
  const [isAddScenarioModalOpen, setIsAddScenarioModalOpen] = useState(false)
  const { getAPIClientForImaginaryUser } = useImaginaryAuth()

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

  // graph related functions.

  const [timelineData, setTimelineData] = useState<any>()
  const [calculatedTimelineData, setCalculatedTimelineData] = useState<any>()

  const skiaRef = useRef<any>(null)

  const timelineDataAPICall = async (dto: { username: string; password: string; scenarioName: string }) => {
    const loginResponse = await tokenClient.post('/', dto)
    const apiClient = getAPIClientForImaginaryUser(loginResponse.data.access, 'v2')
    const goalData = await apiClient.get<GoalItemType[]>('financial_goal/')
    const timelineData = await apiClient.get(`financial_goal/timeline/${goalData?.data[0]?.id}/`)
    return { [dto.scenarioName]: timelineData.data }
  }

  useEffect(() => {
    let chart: any
    if (calculatedTimelineData) {
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          confine: true,
        },
        xAxis: {
          type: 'category',
          boundryGap: false,
          data: calculatedTimelineData?.map((each: any) => dayjs(each?.time)?.format(SERVER_DATE_FORMAT)),
          axisLabel: {
            hideOverlap: true,
            showMinLabel: true,
            showMaxLabel: true,
          },
          offset: 10,
        },
        grid: {
          containLabel: true,
          // left: 80,
        },
        yAxis: {
          type: 'value',
          logBase: 10,
          scale: true,
          axisLabel: {
            formatter: (val: number) => formatIndianMoneyNotation(val),
          },
        },
        animationDurationUpdate: 0,
        series: Object.keys(timelineData)?.map((timeline) => {
          return {
            data: calculatedTimelineData.map((each: any) => each[timeline]),
            type: 'line',
            name: timeline,
            smooth: true,
          }
        }),
      }
      if (skiaRef.current) {
        chart = echarts.init(skiaRef.current, 'dark', {
          renderer: 'svg',
          width: 350,
          height: 350,
        })
      }
      chart?.setOption(option)
    }
    return () => {
      chart?.dispose()
    }
  }, [calculatedTimelineData, timelineData])

  const {
    mutate: login,
    isSuccess,
    isPending,
  } = useMutation({
    mutationFn: async ({ password, username, scenarioName }: any) => {
      const results = await timelineDataAPICall({ password, username, scenarioName })
      return results
    },
    onSuccess: (data) => {
      setTimelineData((prevData: any) => {
        return { ...prevData, ...data }
      })
    },
    onError: () => {
      Toast.show({ description: 'Something went wrong, Please try again.' })
    },
  })

  useEffect(() => {
    if (!isPending && isSuccess) {
      const result = mergeArraysByDate(timelineData)
      setCalculatedTimelineData(result)
    }
  }, [isSuccess, isPending, timelineData])

  const handleSimulate = () => {
    setTimelineData({})
    comparison?.scenarios_objects?.forEach((each) => {
      login({ password: each?.imag_password, username: each?.imag_username, scenarioName: each?.name })
    })
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
        <View bg={'$background'} mx={'$5'} my={'$5'} p={'$4'} br={'$5'}>
          {calculatedTimelineData ? (
            <View>
              <Text>Graph</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleSimulate} style={{ width: 'auto' }}>
              <Text color={'$foreground'}>Press to view chart</Text>
            </TouchableOpacity>
          )}
          {calculatedTimelineData && !isPending && (
            <View h={350} ml={'$-6'}>
              <LineChart ref={skiaRef} />
            </View>
          )}
          {isPending ? (
            <View mt={'$1'}>
              <Text color={'$foreground'}>Loading...</Text>
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
      <ScenarioDialogInComparison
        data={scenariosForAddDialog || []}
        handleAdd={handleAddScenarioToThisComparison}
        handleModalClose={() => setIsAddScenarioModalOpen(false)}
        isModalOpen={isAddScenarioModalOpen}
      />
      <TouchableOpacity style={styles.fab} onPress={handleSimulate}>
        <LineChartIcon />
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: THEME_COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(3),
    position: 'absolute',
    right: wp(8),
  },
  entityButton: { padding: 20 },
})

export default ComparisonWithId
