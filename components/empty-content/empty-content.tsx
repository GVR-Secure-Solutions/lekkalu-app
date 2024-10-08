import { StyleSheet, View, ViewStyle } from 'react-native'
import React from 'react'
import { Text } from 'tamagui'
import { FontSizes } from '@/utils/fonts'

interface EmptyContentProps {
  title: string
  containerStyle?: ViewStyle
}

const EmptyContent = (props: EmptyContentProps) => {
  return (
    <View style={[styles.emptyContentContaier, { ...props?.containerStyle }]}>
      <Text fontSize={FontSizes.size24}>{props?.title}</Text>
    </View>
  )
}

export default EmptyContent

const styles = StyleSheet.create({
  emptyContentContaier: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
