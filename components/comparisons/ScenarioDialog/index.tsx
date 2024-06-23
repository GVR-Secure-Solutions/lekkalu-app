import { Modal } from 'native-base'
import React, { useState } from 'react'
import { View, Text, Button } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontSizes } from '@/utils/fonts'
import { hp } from '@/utils/responsive'
import SelectScenarioToAddInComparison from '../ScenarioInComparison/SelectScenarioToAddInComparison'
import { Scenario } from '@/types/scenarios'

type ScenarioDialogInComparisonType = {
  data: Scenario[]
  isModalOpen: boolean
  handleModalClose: () => void
  handleAdd: (scenarios: Scenario[]) => void
}

const ScenarioDialogInComparison = ({
  data,
  isModalOpen,
  handleModalClose,
  handleAdd,
}: ScenarioDialogInComparisonType) => {
  const insets = useSafeAreaInsets()
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([])

  const checkSelected = (id: number) => {
    return selectedScenarios?.map((each) => each?.id).includes(id)
  }

  const handleScenarioPress = (id: number) => {
    if (selectedScenarios?.map((each) => each?.id).includes(id)) {
      const _afterPress = selectedScenarios.filter((each) => each.id !== id)
      setSelectedScenarios(_afterPress)
    } else {
      const pressedScenarioIndex = data?.findIndex((each) => each?.id === id)
      const _afterPress = [...selectedScenarios, data[pressedScenarioIndex]]
      setSelectedScenarios(_afterPress)
    }
  }

  const handleAddPress = () => {
    handleAdd(selectedScenarios)
    setSelectedScenarios([])
  }

  return (
    <Modal avoidKeyboard isOpen={isModalOpen} onClose={handleModalClose} size="full">
      <Modal.Body>
        <View pt={insets.top + hp(5)} fd="row" jc={'space-between'}>
          <View>
            <Text fontSize={FontSizes.size20}>Add Scenario to this comparison.</Text>
          </View>
          <View>
            <Modal.CloseButton />
          </View>
        </View>
        <View>
          {data?.map((each) => (
            <SelectScenarioToAddInComparison
              isPrivate={each?.access === 'Private'}
              name={each?.name}
              isSelected={checkSelected(each?.id)}
              key={each?.id}
              onPress={handleScenarioPress}
              id={each?.id}
            />
          ))}
        </View>
        <View>
          <Button onPress={handleAddPress}>
            <Text>Add Scenarios</Text>
          </Button>
        </View>
      </Modal.Body>
    </Modal>
  )
}

export default ScenarioDialogInComparison
