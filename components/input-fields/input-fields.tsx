import { Control, Controller, ControllerRenderProps, FieldErrors, FieldValues } from 'react-hook-form'
import { FormControl, Input, Select, TextArea, Radio } from 'native-base'
import { useCallback } from 'react'
import { omit } from 'lodash'
import MultiSelect from 'react-native-multiple-select'
import { useColorScheme } from 'react-native'
import { useTheme, Text } from 'tamagui'
import { InputField } from '@/types/input-fields'
import DatePicker from '../date-picker'
import { theme } from '@/app/_layout'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

type InputFieldsProps = {
  inputs: InputField[]
  control: Control<any>
  errors: FieldErrors
}

export default function InputFields({ inputs, control, errors }: InputFieldsProps) {
  const tamagtheme = useTheme()
  const systemTheme = useColorScheme()

  const inputColor = systemTheme === 'dark' ? 'white' : 'black'

  const getFieldInput = useCallback(
    (input: InputField, field: ControllerRenderProps<FieldValues, string>, errors: FieldErrors) => {
      switch (input.type) {
        case 'text': {
          return (
            <Input
              placeholder={input.label}
              onChangeText={field.onChange}
              color={inputColor}
              fontSize={FontSizes.size15}
              height={hp(5)}
              borderRadius={wp(1)}
              {...field}
            />
          )
        }

        case 'number': {
          return (
            <Input
              color={inputColor}
              {...field}
              value={field.value && String(field.value)}
              keyboardType="numeric"
              placeholder={input.label}
              onChangeText={field.onChange}
              fontSize={FontSizes.size15}
              height={hp(5)}
              borderRadius={wp(1)}
            />
          )
        }

        case 'date': {
          return <DatePicker {...field} />
        }

        case 'select': {
          return (
            <Select
              {...omit(field, 'ref', 'value')}
              placeholder={input.label}
              _selectedItem={{
                bg: theme.colors.brand[900],
                _text: { color: 'white', fontSize: FontSizes.size18 },
                borderRadius: wp(2),
              }}
              height={hp(5)}
              fontSize={FontSizes.size15}
              defaultValue={field.value?.toString()}
              selectedValue={field.value?.toString()}
              onValueChange={field.onChange}
              _text={{ style: { color: tamagtheme.foreground?.get() } }}
              color={inputColor}
              _actionSheetContent={{ bg: systemTheme === 'dark' ? tamagtheme.backgroundHover.get() : 'white' }}
            >
              {input.options.map((option) => (
                <Select.Item
                  _text={{
                    color: inputColor,
                    fontSize: FontSizes.size18,
                  }}
                  bg={systemTheme === 'dark' ? tamagtheme.backgroundHover.get() : 'white'}
                  key={option.id}
                  label={option.label}
                  value={option[input.valueKey || 'id']?.toString()}
                />
              ))}
            </Select>
          )
        }

        case 'multi-select': {
          return (
            <MultiSelect
              items={input.options}
              uniqueKey="id"
              displayKey="label"
              fontSize={FontSizes.size15}
              itemFontSize={FontSizes.size15}
              selectedItems={field.value}
              onSelectedItemsChange={field.onChange}
              tagRemoveIconColor={theme.colors.primary['500']}
              tagBorderColor={theme.colors.primary['500']}
              tagTextColor={theme.colors.primary['500']}
              selectedItemTextColor={theme.colors.primary['500']}
              selectedItemIconColor={theme.colors.primary['500']}
              itemTextColor={tamagtheme.foreground.get()}
              styleSelectorContainer={{ backgroundColor: tamagtheme.background.get() }}
              styleInputGroup={{
                backgroundColor: tamagtheme.background.get(),
                paddingLeft: wp(3),
                paddingRight: wp(3),
                paddingVertical: hp(1),
              }}
              submitButtonColor={theme.colors.primary['500']}
              styleTextDropdown={{ paddingHorizontal: wp(3) }}
              styleTextDropdownSelected={{ paddingHorizontal: wp(3) }}
              styleDropdownMenuSubsection={{
                borderRadius: wp(1),
                backgroundColor: tamagtheme.backgroundHover.get(),
                paddingRight: wp(1.5),
              }}
              flatListProps={{
                contentContainerStyle: { backgroundColor: tamagtheme.background.get() },
              }}
              styleIndicator={{ top: -4 }}
            />
          )
        }

        case 'textarea': {
          return (
            <TextArea
              size={'md'}
              autoCompleteType="none"
              {...field}
              placeholder={input.label}
              onChangeText={field.onChange}
              fontSize={FontSizes.size15}
              h={20}
              color={inputColor}
              isInvalid={input.id in errors}
            />
          )
        }

        case 'radio': {
          return (
            <Radio.Group
              name={input.id}
              value={field.value}
              onChange={field.onChange}
              defaultValue={input.defaultChecked}
              className={input.className}
              style={input.style}
            >
              {input.options.map((each) => (
                <Radio key={each?.id} value={String(each?.id)}>
                  <Text style={{ color: input?.style?.color || inputColor }}>{each?.label}</Text>
                </Radio>
              ))}
            </Radio.Group>
          )
        }

        default: {
          return (
            <Input
              color={inputColor}
              placeholder={input.label}
              onChangeText={field.onChange}
              fontSize={FontSizes.size15}
              height={hp(5)}
              borderRadius={wp(1)}
              {...field}
            />
          )
        }
      }
    },
    [inputColor, tamagtheme],
  )

  return inputs.map((input) => (
    <FormControl key={input.id} isRequired={input.required} isInvalid={input.id in errors}>
      <FormControl.Label _text={{ style: { fontSize: FontSizes.size15, paddingBottom: hp(0.8) } }}>
        {input.label}
      </FormControl.Label>
      <Controller name={input.id} control={control} render={({ field }) => getFieldInput(input, field, errors)} />
      <FormControl.ErrorMessage>{errors[input.id]?.message}</FormControl.ErrorMessage>
    </FormControl>
  ))
}
