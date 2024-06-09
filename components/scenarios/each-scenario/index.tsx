import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme, Text, View } from 'tamagui'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Lock, Unlock } from '@tamagui/lucide-icons'
import { useToast } from 'native-base'
import { hp, wp } from '@/utils/responsive'
import EditDeleteMenu from '../../edit-delete-menu'
import { deleteScenario } from '@/queries/scenario'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { queryClient } from '@/utils/query-client'

export default function EachScenario({ item }: any) {
  const theme = useTheme()
  const toast = useToast()

  const { mutate: removeScenario } = useMutation({
    mutationFn: deleteScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SCENARIO.SCENARIO],
      })
      toast.show({ title: 'Scenario deleted successfully' })
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [SCENARIO.SCENARIO],
      })
    },
  })

  const handleEditScenario = () => {
    router.push({
      pathname: '/(authenticated)/scenarios/add',
      params: { edit: String(true), scenarioDetails: JSON.stringify(item) },
    })
  }

  const handleNavigateToScenario = (id: number) => {
    router.push({
      pathname: `/(authenticated)/scenarios/${id}`,
      params: { id },
    })
  }

  return (
    <TouchableOpacity
      onPress={() => handleNavigateToScenario(item?.id)}
      style={[styles.container, { backgroundColor: theme.background.get() }]}
    >
      <View display="flex" flexDirection="row" gap={20}>
        <View>{item?.access === 'Private' ? <Lock /> : <Unlock />}</View>
        <View width={'$15'}>
          <Text>{item?.name}</Text>
        </View>
      </View>
      <View als={'flex-start'}>
        <EditDeleteMenu onEdit={handleEditScenario} onDelete={() => removeScenario(item?.id)} />
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
