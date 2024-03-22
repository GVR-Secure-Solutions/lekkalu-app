import { InputField } from '@/types/input-fields'

const getAddScenarioInputs = (): InputField[] => {
  return [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
  ]
}

export { getAddScenarioInputs }
