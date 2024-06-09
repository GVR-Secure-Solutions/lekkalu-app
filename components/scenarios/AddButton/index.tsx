import React, { useState } from 'react'
import { Dialog, View, Text, Button } from 'tamagui'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Plus, X } from '@tamagui/lucide-icons'
import { THEME_COLORS } from '@/utils/theme'
import { hp, wp } from '@/utils/responsive'
import { ScenarioEntities } from '@/app/(authenticated)/scenarios/[id]'

type AddButtonForScenarioType = {
  handlePress: (entity: ScenarioEntities) => void
}

const AddButtonForScenario = ({ handlePress }: AddButtonForScenarioType) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const onPress = (entity: ScenarioEntities) => {
    setIsDialogOpen(false)
    handlePress(entity)
  }

  return (
    <View>
      <TouchableOpacity style={styles.fab} onPress={() => setIsDialogOpen(true)}>
        <Plus />
      </TouchableOpacity>
      <Dialog open={isDialogOpen} modal>
        <Dialog.Portal>
          <Dialog.Overlay key={'overlay'} />
          <Dialog.Content>
            <Dialog.Title>
              <Dialog.Close asChild>
                <View flexDirection="row" justifyContent="flex-end">
                  <Button size="$2" circular icon={X} onPress={() => setIsDialogOpen(false)} />
                </View>
              </Dialog.Close>
            </Dialog.Title>
            <View h={'20%'}>
              <TouchableOpacity onPress={() => onPress('Asset')}>
                <Text>Asset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPress('Liabilities')}>
                <Text>Liabilities</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPress('Expense')}>
                <Text>Monthly Expenses</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: THEME_COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(3),
    position: 'absolute',
    right: wp(8),
  },
})

export default AddButtonForScenario
