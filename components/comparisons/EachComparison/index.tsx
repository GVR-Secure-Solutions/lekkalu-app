import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Unlock, Lock } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { View, Text, useTheme } from 'tamagui'
import EditDeleteMenu from '@/components/edit-delete-menu'
import { hp, wp } from '@/utils/responsive'
import { deleteComparison, updateComparison } from '@/queries/scenario'
import { COMPARISON } from '@/utils/query-keys/scenarios'
import { AddComparisonSchema } from '@/schema/comparisons'

type EachComparisonType = {
  access: 'Private' | 'Public'
  id: number
  name: string
}

const EachComparison = ({ access, name, id }: EachComparisonType) => {
  const theme = useTheme()
  const qc = useQueryClient()

  const handleNavigationToComparison = () => {
    router.push({
      pathname: `/(authenticated)/comparisons/${id})`,
      params: { id },
    })
  }

  const { mutate: remove } = useMutation({
    mutationFn: () => deleteComparison(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPARISON.COMPARISON] })
    },
  })

  const { mutate: updatePrivacy } = useMutation({
    mutationFn: (values: Partial<AddComparisonSchema>) => updateComparison(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPARISON.COMPARISON] })
    },
  })

  const handlePrivacyChange = (value: 'Private' | 'Public') => {
    updatePrivacy({ access: value })
  }

  return (
    <TouchableOpacity
      key={id}
      onPress={handleNavigationToComparison}
      style={[styles.container, { backgroundColor: theme.background.get() }]}
    >
      <View display={'flex'} fd="row" gap={20}>
        <View jc={'center'}>{access === 'Private' ? <Lock /> : <Unlock />}</View>
        <View width={'$15'}>
          <Text>{name}</Text>
        </View>
      </View>
      <View als={'flex-start'}>
        <EditDeleteMenu
          onEdit={() =>
            router.push({
              pathname: '/(authenticated)/comparisons/add',
              params: { isEdit: 'true', id },
            })
          }
          onDelete={remove}
          extraMenus={[
            {
              name: `Set to ${access === 'Private' ? 'Public' : 'Private'}`,
              onPress: () => handlePrivacyChange(access === 'Private' ? 'Public' : 'Private'),
            },
          ]}
        />
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
