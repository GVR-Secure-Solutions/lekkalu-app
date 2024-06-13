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
        <Plus color={'white'} />
      </TouchableOpacity>
      <Dialog open={isDialogOpen} onOpenChange={(value) => setIsDialogOpen(value)}>
        <Dialog.Portal key={'Expense-dialog-portal'}>
          <Dialog.Overlay key={'overlay'} onPress={() => setIsDialogOpen(false)} />
          <Dialog.Content style={{ width: '100%', marginTop: 'auto' }} key={'Expense-dialog-content'}>
            <Dialog.Title ml="auto">
              <Dialog.Close asChild>
                <View>
                  <Button size="$2" circular icon={X} onPress={() => setIsDialogOpen(false)} />
                </View>
              </Dialog.Close>
            </Dialog.Title>
            <View h={'25%'}>
              <TouchableOpacity onPress={() => onPress('Asset')} style={styles.entityButton}>
                <Text>Asset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPress('Liabilities')} style={styles.entityButton}>
                <Text>Liabilities</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPress('Expense')} style={styles.entityButton}>
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
  entityButton: { padding: 20 },
})

export default AddButtonForScenario
