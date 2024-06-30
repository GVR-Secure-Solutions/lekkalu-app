import React from 'react'
import { View } from 'tamagui'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Plus } from '@tamagui/lucide-icons'
import LendingList from '@/components/lending-list/lending-list'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'

const Lending = () => {
  return (
    <View flex={1} p={4} bg="$backgroundHover">
      <View marginTop={12} alignSelf="center" width={'95%'} flex={1}>
        <LendingList />
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/(authenticated)/create-lending-account')}>
          <Plus size={wp(8)} color={'white'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Lending

const styles = StyleSheet.create({
  fab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: THEME_COLORS.primary[400],
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(3),
    position: 'absolute',
    right: wp(4),
  },
  container: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderRadius: wp(4),
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    alignItems: 'center',
    rowGap: hp(1),
    flex: 0.45,
  },
})
