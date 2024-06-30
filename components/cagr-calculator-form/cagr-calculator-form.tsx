import React, { useContext } from 'react'
import { View } from 'tamagui'
import InputWithSlider from '@/components/input-with-slider'
import { hp, wp } from '@/utils/responsive'
import { CagrCalculatorContext } from '@/context/cagr-calculator-provider'

const CAGRCalculatorForm = () => {
  const { setInitialValue, setFinalValue, setInvestmentDuration } = useContext(CagrCalculatorContext)
  return (
    <View
      bg="$background"
      px={wp(4)}
      pt={hp(1.5)}
      br={wp(4)}
      mt={hp(2)}
      rowGap={hp(1)}
      pb={hp(3)}
      elevationAndroid={3}
      shadowColor={'black'}
      shadowOpacity={0.1}
      shadowOffset={{ height: 0, width: 0 }}
      shadowRadius={wp(1)}
      mx={wp(4)}
    >
      <InputWithSlider
        defaultValue='5000'
        label="Initial value (₹)"
        sliderMaxValue={10000000}
        sliderMinValue={1000}
        setValue={setInitialValue}
        showInfoTooltip
        tooltipText="This is the starting value or principal investment amount. It represents the value of your investment or asset at the beginning of the investment period."
        sliderstep={1}
      />
      <InputWithSlider
       defaultValue='25000'
        label="Final value costs (₹)"
        sliderMaxValue={10000000}
        sliderMinValue={1000}
        setValue={setFinalValue}
        showInfoTooltip
        tooltipText="This is the ending value or the current value of your investment after the specified duration. It represents the value of your investment at the end of the investment period."
        sliderstep={1}
      />
      <InputWithSlider
        defaultValue='5'
        label="Duration of Investment (Years)"
        sliderMaxValue={40}
        sliderMinValue={1}
        setValue={setInvestmentDuration}
        showInfoTooltip
        tooltipText="This is the length of time, in years, for which you held the investment. It represents the time period between the initial and final values."
        sliderstep={1}
        allowFractionDigits={false}
      />
    </View>
  )
}

export default CAGRCalculatorForm
