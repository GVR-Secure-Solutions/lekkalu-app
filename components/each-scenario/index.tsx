import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme, Text, View } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import EditDeleteMenu from '../edit-delete-menu'

export default function EachScenario({ item }: any) {
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={() => {}} style={[styles.container, { backgroundColor: theme.background.get() }]}>
      <View width={'$20'}>
        <Text>{item?.name}</Text>
      </View>
      <View als={'flex-start'}>
        <EditDeleteMenu onEdit={() => {}} onDelete={() => {}} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    textAlign: 'center',
  },
})
