import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlatList } from 'native-base'
import { useQuery } from '@tanstack/react-query'
import BackButton from '@/components/back-button/back-button'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { COMPARISON } from '@/utils/query-keys/scenarios'
import { fetchComparisons } from '@/queries/scenario'
import EachComparison from '@/components/comparisons/EachComparison'

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
})
