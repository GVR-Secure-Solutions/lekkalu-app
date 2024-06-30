import { InputField } from '@/types/input-fields'

export const ASSET_MONTHS = Array.from({ length: 12 }, (_, index) => ({
  id: `${index + 1}`,
  label: `${index + 1}`,
}))

export const ASSET_YEARS = Array.from({ length: 41 }, (_, index) => ({
  id: index.toString(),
  label: index.toString(),
}))

export const ASSET_INPUTS: InputField[] = [
  {
    id: 'name',
    label: 'Asset name',
    type: 'text',
    required: true,
  },
  {
    id: 'purchase_value',
    label: 'Purchase value',
    type: 'number',
    required: true,
  },
  {
    id: 'purchase_date',
    label: 'Choose the purchase date',
    type: 'date',
    defaultDate: undefined,
    required: true,
  },
  {
    id: 'sell_value',
    label: 'Sell value',
    type: 'number',
  },
  {
    id: 'sell_date',
    label: 'Choose the sell date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'depreciation_percent',
    label: 'Choose depreciation %',
    type: 'number',
    required: true,
  },
  {
    id: 'init_dep',
    label: 'Initial depreciation',
    type: 'number',
    required: true,
  },
  {
    id: 'market_value',
    label: 'Market Value',
    type: 'number',
  },
  {
    id: 'months',
    label: 'Months',
    type: 'select',
    required: true,
    options: ASSET_MONTHS,
  },
  {
    id: 'years',
    label: 'Years',
    type: 'select',
    required: true,
    options: ASSET_YEARS,
  },
]

export const ASSET_INPUTS_FOR_SCENARIO: InputField[] = [
  {
    id: 'name',
    label: 'Asset name',
    type: 'text',
    required: true,
  },
  {
    id: 'purchase_value',
    label: 'Purchase value',
    type: 'number',
    required: true,
  },
  {
    id: 'purchase_date',
    label: 'Choose the purchase date',
    type: 'date',
    defaultDate: undefined,
    required: true,
  },
  {
    id: 'sell_value',
    label: 'Sell value',
    type: 'number',
  },
  {
    id: 'sell_date',
    label: 'Choose the sell date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'depreciation_percent',
    label: 'Choose depreciation %',
    type: 'number',
    required: true,
  },
  {
    id: 'init_dep',
    label: 'Initial depreciation',
    type: 'number',
    required: true,
  },
  {
    id: 'market_value',
    label: 'Market Value',
    type: 'number',
  },
]
