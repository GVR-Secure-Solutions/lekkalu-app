import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from 'tamagui'
import { router } from 'expo-router'
import { Plus } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlatList } from 'native-base'
import { useQuery } from '@tanstack/react-query'
import BackButton from '@/components/back-button/back-button'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { COMPARISON } from '@/utils/query-keys/scenarios'
import { fetchComparisons } from '@/queries/scenario'
import EachComparison from '@/components/comparisons/EachComparison'
import { THEME_COLORS } from '@/utils/theme'

const Comparisons = () => {
  const insets = useSafeAreaInsets()
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [COMPARISON.COMPARISON],
    queryFn: fetchComparisons,
    staleTime: 0,
  })
  return (
    <View f={1} pt={insets.top + hp(2)} bg={'$backgroundHover'}>
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)} mb={wp(10)}>
        <BackButton />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          Your Comparisons
        </Text>
      </View>
      <FlatList
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <View>
                <Text>Loading</Text>
              </View>
            )
          }
          return (
            <View h={hp(35)} jc="center" ai="center">
              <Text fontSize={FontSizes.size24} fontWeight={'bold'}>
                No Comparisons Found.
              </Text>
            </View>
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        data={data}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={({ item }) => <EachComparison id={item?.id} name={item?.name} access={item?.access} />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(authenticated)/comparisons/add')}>
        <Plus size={wp(8)} color={'white'} />
      </TouchableOpacity>
    </View>
  )
}

export default Comparisons

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
