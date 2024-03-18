import { InputField } from '@/types/input-fields'

const getAddScenarioInputs = (liability: any, assets: any, income: any): InputField[] => {
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
      type: 'multi-select',
      options: liability || [],
      required: true,
    },
    {
      id: 'assets',
      label: 'Assets',
      type: 'multi-select',
      options: assets || [],
      required: true,
    },
    {
      id: 'income',
      label: 'Income',
      type: 'multi-select',
      options: income || [],
      required: true,
    },
  ]
}

export { getAddScenarioInputs }
