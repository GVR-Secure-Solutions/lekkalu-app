import { X } from '@tamagui/lucide-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, View } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'

type ScenarioInComparisonInAddScreenType = {
  id: number
  name: string
  access?: string
  handleRemove: (id: number) => void
}

const ScenarioInComparisonInAddScreen = ({ id, name, handleRemove }: ScenarioInComparisonInAddScreenType) => {
  return (
    <View key={id} backgroundColor={'$backgroundHover'} px={'$5'} py={'$5'} overflow="visible">
      <Text>{name}</Text>
      <TouchableOpacity
        onPress={() => handleRemove(id)}
        style={{
          position: 'absolute',
          right: 0,
          top: -6,
          backgroundColor: THEME_COLORS.red[500],
          borderRadius: 100,
          padding: 5,
        }}
      >
        <X size={FontSizes.size15} color={'white'} />
      </TouchableOpacity>
    </View>
  )
}

export default ScenarioInComparisonInAddScreen
