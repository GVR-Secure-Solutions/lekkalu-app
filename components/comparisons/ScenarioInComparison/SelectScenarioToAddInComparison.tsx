import React from 'react'
import { TouchableOpacity, useColorScheme } from 'react-native'
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
  const systemTheme = useColorScheme()
  const background = systemTheme === 'dark' ? 'black' : 'white'
  const textColor = systemTheme === 'dark' ? 'white' : 'black'
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: background,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
      }}
      disabled={isPrivate}
      onPress={() => onPress(id)}
    >
      <View alignSelf="center">
        {isSelected ? (
          <CheckCircle2 color={isPrivate ? '$gray10' : textColor} />
        ) : (
          <CircleDashed color={isPrivate ? '$gray10' : textColor} />
        )}
      </View>
      <View px={'$3'}>
        <Text fontSize={FontSizes.size15} color={isPrivate ? '$gray10' : textColor}>
          {name}
        </Text>
      </View>
      <View ml={'auto'}>{isPrivate ? <Lock color={'$red10Dark'} /> : <></>}</View>
    </TouchableOpacity>
  )
}

export default SelectScenarioToAddInComparison
