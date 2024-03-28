import React from 'react'
import { View, Text } from 'tamagui'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { BookCopy, Target } from '@tamagui/lucide-icons'

import FeatureCard from '@/components/feature-card'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'

const features = [
  {
    title: 'Income Statement',
    image: <Feather name="dollar-sign" size={wp(6)} color={THEME_COLORS.primary[100]} />,
  },
  {
    title: 'EMI Calculator',
    image: <FontAwesome name="calculator" size={wp(6)} color={THEME_COLORS.primary[100]} />,
  },
  {
    title: 'Goals',
    image: <Target size={wp(7)} color={THEME_COLORS.primary[100]} />,
  },
  {
    title: 'Scenarios',
    image: <BookCopy size={wp(7)} color={THEME_COLORS.primary[100]} />,
  },
]

const Dashboard = () => {
  const handleOnPressFeature = (title: string) => {
    switch (title) {
      case 'Income Statement':
        router.push('/(authenticated)/income-statement')
        break
      case 'EMI Calculator':
        router.push('/(authenticated)/emi-calculator')
        break
      case 'Goals':
        router.push('/(authenticated)/goals')
        break
      case 'Scenarios':
        router.push('/(authenticated)/scenarios')
        break
      default:
        break
    }
  }

  return (
    <View p={wp(4)} f={1} bg="$backgroundHover">
      <Text mb={hp(2)} fontSize={FontSizes.size26} fontFamily={'$heading'}>
        Browse Features
      </Text>
      <View fd="row" ai="center" columnGap={wp(3)} flexWrap="wrap" rowGap={wp(3)}>
        {features.map((item, index) => (
          <FeatureCard
            onPress={() => handleOnPressFeature(item.title)}
            containerStyle={{ width: wp(28.5) }}
            key={`feature-${index}`}
            {...item}
          />
        ))}
      </View>
    </View>
  )
}

export default Dashboard
