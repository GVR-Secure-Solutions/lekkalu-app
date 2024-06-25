import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { FlatList } from 'native-base'
import { router, useLocalSearchParams } from 'expo-router'
import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button/back-button'
import { COMPARISON } from '@/utils/query-keys/scenarios'
import { fetchComparisonById } from '@/queries/scenario'
import PrivacyButton from '@/components/scenarios/PrivacyButton'
import { FontSizes } from '@/utils/fonts'
import EachScenario from '@/components/scenarios/each-scenario'

const ComparisonWithId = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const comparisonId = +params.id

  const { data: comparison } = useQuery({
    queryKey: [`${COMPARISON.COMPARISON}-${comparisonId}`],
    queryFn: () => fetchComparisonById(comparisonId),
    staleTime: 0,
  })

  return (
    <View f={1} pt={insets.top + hp(2)} bg={'$backgroundHover'}>
      <View fd="row" ml={wp(5)} mr={wp(14)}>
        <View fd={'row'} columnGap={wp(4)}>
          <BackButton onPress={() => router.replace('/(authenticated)/comparisons')} />
          <Text fontSize={FontSizes.size20} fontFamily={'$heading'} w={'85%'}>
            {comparison?.name}
          </Text>
        </View>
        <View>
          <PrivacyButton
            isPublic={comparison?.access === 'Public'}
            handleMutation={() => {}}
            isSuccess={false}
            isLoading={false}
            name="comparison"
          />
        </View>
      </View>
      <FlatList
        style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 40 }}
        data={comparison?.scenarios_objects}
        ListEmptyComponent={() => {
          return (
            <View>
              <Text>Please add scenarios to this comparison.</Text>
            </View>
          )
        }}
        renderItem={({ item }) => <EachScenario item={item} />}
      />
    </View>
  )
}

export default ComparisonWithId
