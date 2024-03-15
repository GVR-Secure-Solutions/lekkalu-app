import { Feather } from '@expo/vector-icons'
import React, { Dispatch, FC, SetStateAction, memo, useState } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle, useColorScheme } from 'react-native'
import { Input, Label, Text, View, useTheme } from 'tamagui'
import { Popover } from 'native-base'
import Slider from '@react-native-community/slider'
import debounce from 'lodash/debounce'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

interface IInputWithSliderProps {
  label: string
  containerStyle?: StyleProp<ViewStyle>
  sliderMaxValue: number
  sliderMinValue: number
  defaultValue?: string
  setValue: Dispatch<SetStateAction<string>>
  showInfoTooltip?: boolean
  tooltipText?: string
  sliderstep?: number
  allowFractionDigits?: boolean
}

const InputWithSlider: FC<IInputWithSliderProps> = ({
  label,
  containerStyle,
  setValue,
  sliderMaxValue = 100,
  sliderMinValue = 0,
  defaultValue = '0',
  tooltipText = '',
  showInfoTooltip = false,
  sliderstep = 0,
  allowFractionDigits = true,
}) => {
  const theme = useTheme()
  const [localvalue, setLocalValue] = useState(defaultValue)
  const systemTheme = useColorScheme()

  const debouncedSetValue = debounce(setValue, 300)

  const handleInputValueChange = (text: string) => {
    let parsedValue = ''

    if (allowFractionDigits) {
      parsedValue = text.trim().replace(' ', '')
    } else {
      parsedValue = (+text.trim().replace(' ', '').replace('.', '')).toString()
    }

    if (isNaN(+parsedValue)) {
      return
    }
    setLocalValue(parsedValue)
    debouncedSetValue(parsedValue)
  }

  const handleSliderValueChange = (val: number) => {
    const newVal = allowFractionDigits ? parseFloat(val.toString()).toFixed(2) : val.toString()
    debouncedSetValue(newVal)
    setLocalValue(newVal)
  }

  return (
    <View style={containerStyle}>
      <View fd="row" ai="center" columnGap={wp(2)}>
        <Label fontSize={FontSizes.size18} pb={hp(0.8)}>
          {label}
        </Label>
        {!!showInfoTooltip && (
          <Popover
            trigger={(triggerProps) => {
              return (
                <TouchableOpacity style={{ top: -4 }} hitSlop={15} {...triggerProps}>
                  <Feather name="info" size={hp(2.5)} color={theme.foreground.get()} />
                </TouchableOpacity>
              )
            }}
          >
            <Popover.Content accessibilityLabel="Delete Customerd" w={wp(60)}>
              <Popover.Arrow bgColor={theme.backgroundHover.get()} />
              <Popover.Body bgColor={theme.backgroundHover.get()}>
                <Text
                  color={systemTheme === 'dark' ? '$foreground' : '$background'}
                  fontFamily={'$heading'}
                  fontSize={FontSizes.size15}
                  lineHeight={'$1'}
                >
                  {tooltipText}
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        )}
      </View>
      <Input
        fontSize={FontSizes.size15}
        height={hp(5)}
        mb={hp(0.5)}
        value={localvalue}
        onChangeText={handleInputValueChange}
      />
      <Slider
        style={styles.slider}
        minimumValue={sliderMinValue}
        maximumValue={sliderMaxValue}
        minimumTrackTintColor="#003562"
        maximumTrackTintColor="#e1e1e1"
        thumbTintColor="#003562"
        onValueChange={handleSliderValueChange}
        step={sliderstep}
      />
    </View>
  )
}

export default memo(InputWithSlider)

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 34,
  },
})
