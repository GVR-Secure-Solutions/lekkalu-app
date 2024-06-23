import { InputField } from '@/types/input-fields'

const COMPARISON_INPUT: InputField[] = [
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
    defaultChecked: 'Public',
    style: { gap: 10 },
  },
]

export { COMPARISON_INPUT }
