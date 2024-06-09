import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text } from 'tamagui'
import { TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { Plus } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import EachScenario from '@/components/scenarios/each-scenario'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { fetchScenarios } from '@/queries/scenario'

const Scenarios = () => {
  const insets = useSafeAreaInsets()
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [SCENARIO.SCENARIO],
    queryFn: fetchScenarios,
  })
  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)} mb={wp(10)}>
        <BackButton />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          Your Scenarios
        </Text>
      </View>
      <FlatList
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <View>
                <Text>Loading...</Text>
              </View>
            )
          }
          return (
            <View h={hp(35)} jc="center" ai="center">
              <Text fontSize={FontSizes.size24} fontWeight={'bold'}>
                No Scenarios Added
              </Text>
            </View>
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        data={data}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={({ item }) => <EachScenario item={item} />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(authenticated)/scenarios/add')}>
        <Plus size={wp(8)} color={'white'} />
      </TouchableOpacity>
    </View>
  )
}

export default Scenarios

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: wp(5),
    rowGap: hp(1.5),
    paddingBottom: hp(10),
  },
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
})
