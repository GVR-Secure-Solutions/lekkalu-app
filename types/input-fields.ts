import { StyleProp, ViewStyle } from 'react-native'

type BaseInput = {
  id: string
  label: string
  className?: string
  style?: React.CSSProperties
  value?: any
  required?: boolean
}

type NumberInput = BaseInput & {
  type: 'number'
  hasRange?: boolean
  range?: {
    min: number
    max: number
    step: number
  }
}

type DateInput = BaseInput & {
  type: 'date'
  defaultDate?: Date
}

export type Option = {
  id: string | number
  label: string
}

type MultiSelectInput = BaseInput & {
  type: 'multi-select'
  options: Option[]
  valueFormatter?: (value: string | number) => string | number
}

type SelectInput = BaseInput & {
  type: 'select'
  options: Option[]
  valueFormatter?: (value: string | number) => string | number
  valueKey?: string
}

type TextInput = BaseInput & {
  type: 'text'
}

type RadioInput = BaseInput & {
  type: 'radio'
  options: Option[]
  defaultChecked?: string
  style: StyleProp<ViewStyle>
}

type TextareaInput = BaseInput & {
  type: 'textarea'
}

export type InputField =
  | NumberInput
  | DateInput
  | MultiSelectInput
  | TextInput
  | SelectInput
  | RadioInput
  | TextareaInput
