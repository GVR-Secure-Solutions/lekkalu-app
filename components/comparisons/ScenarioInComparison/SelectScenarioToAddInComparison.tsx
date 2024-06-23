import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View, Text } from 'tamagui'
import { CircleDashed, Lock, CheckCircle2 } from '@tamagui/lucide-icons'
import { FontSizes } from '@/utils/fonts'

type SelectScenarioToAddInComparisonType = {
  isSelected: boolean
  name: string
  isPrivate: boolean
  onPress: (id: number) => void
  id: number
}

const SelectScenarioToAddInComparison = ({
  isSelected,
  name,
  isPrivate,
  onPress,
  id,
}: SelectScenarioToAddInComparisonType) => {
  return (
    <TouchableOpacity style={{ flexDirection: 'row' }} disabled={isPrivate} onPress={() => onPress(id)}>
      <View>{isSelected ? <CheckCircle2 /> : <CircleDashed />}</View>
      <View>
        <Text fontSize={FontSizes.size18}>{name}</Text>
      </View>
      <View>{isPrivate ? <Lock /> : <></>}</View>
    </TouchableOpacity>
  )
}

export default SelectScenarioToAddInComparison
