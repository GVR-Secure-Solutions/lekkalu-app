import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Unlock, Lock } from '@tamagui/lucide-icons'
import { View, Text, useTheme } from 'tamagui'
import EditDeleteMenu from '@/components/edit-delete-menu'
import { hp, wp } from '@/utils/responsive'

type EachComparisonType = {
  access: 'Private' | 'Public'
  id: number
  name: string
}

const EachComparison = ({ access, name, id }: EachComparisonType) => {
  const theme = useTheme()
  return (
    <TouchableOpacity
      key={id}
      onPress={() => {}}
      style={[styles.container, { backgroundColor: theme.background.get() }]}
    >
      <View display={'flex'} fd="row" gap={20}>
        <View jc={'center'}>{access === 'Private' ? <Lock /> : <Unlock />}</View>
        <View width={'$15'}>
          <Text>{name}</Text>
        </View>
      </View>
      <View als={'flex-start'}>
        <EditDeleteMenu onEdit={() => {}} onDelete={() => {}} />
      </View>
    </TouchableOpacity>
  )
}

export default EachComparison

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
