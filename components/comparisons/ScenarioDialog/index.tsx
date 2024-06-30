import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Modal } from 'native-base'
import { View, Text, Button } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
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
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([])

  const systemTheme = useColorScheme()
  const background = systemTheme === 'dark' ? '#2d3436' : 'white'
  const textColor = systemTheme === 'dark' ? 'white' : '#2d3436'

  const checkSelected = (id: number) => {
    return selectedScenarios?.map((each) => each?.id).includes(id)
  }

  const handleClose = () => {
    setSelectedScenarios([])
    handleModalClose()
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
    <Modal avoidKeyboard isOpen={isModalOpen} onClose={handleClose} size={'full'}>
      <Modal.Content style={{ backgroundColor: background }}>
        <Modal.Header style={{ backgroundColor: background }}>
          <Modal.CloseButton />
          <View>
            <Text fontSize={FontSizes.size15} color={textColor}>
              Add Scenario to this comparison.
            </Text>
          </View>
        </Modal.Header>
        <Modal.Body>
          <View fd="row" jc={'space-between'}>
            <View>
              <Modal.CloseButton />
            </View>
          </View>
          <View gap={10} pb={15}>
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
          <Button onPress={handleAddPress}>
            <Text>Add Scenarios</Text>
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default ScenarioDialogInComparison
