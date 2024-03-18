import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text } from 'tamagui'
import { TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import EachScenario from '@/components/each-scenario'

const data = [
  {
    id: 1,
    name: 'Want to invest with current salary',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 2,
    name: 'I have mortgage, should i invest?',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 3,
    name: 'Important investment, could lose everything i ever owned.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 4,
    name: 'Nothing to lose, suggest how should i invest my money.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
]

const Scenarios = () => {
  const insets = useSafeAreaInsets()
  const isLoading = false
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
