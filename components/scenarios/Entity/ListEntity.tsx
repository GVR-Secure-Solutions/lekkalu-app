import React from 'react'
import { View, Text, useTheme } from 'tamagui'
import { FlatList } from 'native-base'
import { ScenarioEntities } from '@/app/(authenticated)/scenarios/[id]'
import { wp } from '@/utils/responsive'

type ListEntityType = {
  data: any
  isLoading: boolean
  refetch: any
}

const ListEntity = ({ data, isLoading, refetch }: ListEntityType) => {
  const theme = useTheme()
  const getTextColor = (type: ScenarioEntities) => {
    switch (type) {
      case 'Asset':
        return '$green10'
      case 'Liabilities':
        return '$red10'
      case 'Expense':
        return '$blue10'
    }
  }

  return (
    <FlatList
      style={{ padding: 20 }}
      data={data}
      refreshing={isLoading}
      ListEmptyComponent={() => {
        if (isLoading) {
          return (
            <View>
              <Text>Loading...</Text>
            </View>
          )
        } else {
          return (
            <View>
              <Text>Please add Assets, Liabilities and Monthly Expenses in your scenario</Text>
            </View>
          )
        }
      }}
      renderItem={({ item }: any) => {
        return (
          <View
            p={10}
            bg={theme.background.get()}
            m={5}
            key={item?.id}
            borderRadius={5}
            elevationAndroid={4}
            shadowOffset={{ height: 0, width: 0 }}
            shadowColor={'black'}
            shadowOpacity={0.1}
            shadowRadius={wp(1)}
          >
            <Text fontSize={'$1'} mb={3} color={getTextColor(item?.entity_type)}>
              {item?.entity_type}
            </Text>
            <Text fontSize={'$7'}>{item?.name || ''}</Text>
            <Text pt={8}>Rs. {item?.amount}</Text>
          </View>
        )
      }}
      onRefresh={refetch}
    />
  )
}
export default ListEntity
