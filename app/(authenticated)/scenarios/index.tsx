import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'tamagui'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'

const Scenarios = () => {
  const insets = useSafeAreaInsets()
  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(authenticated)/scenarios/add')}>
        <Plus size={wp(8)} color={'white'} />
      </TouchableOpacity>
    </View>
  )
}

export default Scenarios

const styles = StyleSheet.create({
  // carousel: {
  //   alignSelf: 'center',
  //   marginTop: hp(2),
  //   marginLeft: wp(5),
  // },
  // listContent: {
  //   paddingHorizontal: wp(5),
  //   rowGap: hp(1.5),
  //   paddingBottom: hp(10),
  // },
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
