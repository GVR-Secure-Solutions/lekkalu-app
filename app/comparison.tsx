import React, { useRef, useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, StyleSheet, Share } from 'react-native'
import { Toast } from 'native-base'
import { useMutation, useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text, ScrollView } from 'tamagui'
import dayjs from 'dayjs'

import * as echarts from 'echarts/core'
import { LineChart as LC } from 'echarts/charts'
import { SVGRenderer } from '@wuba/react-native-echarts'
import {
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'

import { Share as ShareIcon, LineChart as LineChartIcon } from '@tamagui/lucide-icons'
import { fetchComparisonById } from '@/queries/scenario'
import { COMPARISON } from '@/utils/query-keys/scenarios'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import LineChart from '@/components/LineChart'
import { formatIndianMoneyNotation } from '@/utils/fn'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { mergeArraysByDate } from '@/utils/comparison-timeline'
import { tokenClient } from '@/utils/client'
import { useImaginaryAuth } from '@/hooks/use-imaginary-auth'
import { GoalItemType } from '@/queries/goal'
import AuthenticationCardForUnAuthenticatedUsers from '@/components/AuthenticationCardForUnAuthenticatedUsers'
import { WEB_URL } from '@/utils/constant/constant'

echarts.use([SVGRenderer, GridComponent, LegendComponent, DataZoomComponent, TooltipComponent, ToolboxComponent, LC])

const ComparisonForUnAuthenticatedUser = () => {
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const comparisonId = +params.id

  const { getAPIClientForImaginaryUser } = useImaginaryAuth()

  const { data: comparison } = useQuery({
    queryKey: [`${COMPARISON.COMPARISON}-${comparisonId}`],
    queryFn: () => fetchComparisonById(comparisonId),
    staleTime: 0,
  })

  async function handleShare() {
    const sharingLink = `${WEB_URL}/comparisons/${comparisonId}`
    await Share.share({
      title: comparison?.name,
      url: sharingLink,
      message: sharingLink,
    })
  }

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

  return (
    <>
      <ScrollView f={1} pt={insets.top + hp(2)} bg={'$backgroundHover'}>
        <View fd="row" ml={wp(5)} mr={wp(14)}>
          <View fd={'row'} columnGap={wp(4)}>
            <Text fontSize={FontSizes.size18} fontFamily={'$heading'} w={'92%'}>
              {comparison?.name || 'Placeholder name which can be long'}
            </Text>
            <View>
              <ShareIcon onPress={handleShare} />
            </View>
          </View>
        </View>
        <View ml={wp(5)} mr={wp(5)} mt={20} backgroundColor={'$background'} br={'$5'} p="$4">
          <View fd="row" alignItems="center" jc={'space-between'}>
            <Text fontSize={'$5'} color={'$foreground'}>
              Scenarios in this comparison
            </Text>
          </View>
          <FlatList
            style={{ marginTop: 20 }}
            contentContainerStyle={{ gap: 20, paddingRight: 15 }}
            data={comparison?.scenarios_objects}
            horizontal
            showsHorizontalScrollIndicator
            ListEmptyComponent={() => {
              return (
                <View>
                  <Text>No scenarios found in this comparison.</Text>
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
                  minHeight: 120,
                }}
                onPress={() => {
                  router.push({
                    pathname: `/scenarios/${item?.id}`,
                    params: { id: item?.id, backToComparison: String(comparisonId) },
                  })
                }}
              >
                <Text w="85%">{item?.name}</Text>
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
            <TouchableOpacity
              onPress={handleSimulate}
              style={{ width: 'auto' }}
              disabled={!comparison?.scenarios?.length}
            >
              <Text color={'$foreground'}>
                {comparison?.scenarios?.length ? 'Press to view chart' : 'No scenarios to visualize.'}
              </Text>
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
      </ScrollView>
      <TouchableOpacity
        style={{ ...styles.fab, backgroundColor: comparison?.scenarios?.length ? THEME_COLORS?.brand[900] : 'gray' }}
        onPress={handleSimulate}
        disabled={!comparison?.scenarios?.length}
      >
        <LineChartIcon color={'white'} />
      </TouchableOpacity>
      <AuthenticationCardForUnAuthenticatedUsers />
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(13),
    position: 'absolute',
    right: wp(8),
  },
})

export default ComparisonForUnAuthenticatedUser
