import { InputField } from '@/types/input-fields'

const getAddScenarioInputs = (): InputField[] => {
  return [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      id: 'access',
      label: 'Access',
      type: 'radio',
      options: [
        { id: 'Public', label: 'Public' },
        { id: 'Private', label: 'Private' },
      ],
      defaultChecked: 'public',
      style: { gap: 10 },
    },
  ]
}

export { getAddScenarioInputs }
