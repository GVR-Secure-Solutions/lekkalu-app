import { InputField } from '@/types/input-fields'

const getAddScenarioInputs = (liability: any, assets: any): InputField[] => {
  return [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      id: 'liabilities',
      label: 'Liabilities',
      type: 'select',
      options: liability || [],
      valueKey: 'value',
      required: true,
    },
    {
      id: 'assets',
      label: 'Assets',
      type: 'select',
      options: assets || [],
      valueKey: 'value',
      required: true,
    },
  ]
}

export { getAddScenarioInputs }
