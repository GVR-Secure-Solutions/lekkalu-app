import React, { FC } from 'react'
import { Text, View } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

interface IKeyValueTextProps {
  title: string
  value: string
}

const KeyValueText: FC<IKeyValueTextProps> = ({ title = '', value = '' }) => {
  return (
    <Text fontSize={FontSizes.size15}>
      -{' '}
      <Text fontSize={FontSizes.size15} fontFamily={'$body'} fontWeight={'bold'}>
        {title}:
      </Text>{' '}
      {value}
    </Text>
  )
}

const CagrCalculatorFormula = () => {
  return (
    <View
      bg="$background"
      px={wp(4)}
      pt={hp(1.5)}
      br={wp(4)}
      mt={hp(2)}
      mb={hp(2)}
      rowGap={hp(1)}
      pb={hp(3)}
      elevationAndroid={3}
      shadowColor={'black'}
      shadowOpacity={0.1}
      shadowOffset={{ height: 0, width: 0 }}
      shadowRadius={wp(1)}
      mx={wp(4)}
    >
      <Text fontFamily={'$heading'} fontSize={FontSizes.size24} fontWeight={'bold'}>
      CAGR Formula
      </Text>
      <Text fontSize={FontSizes.size15} fontFamily={'$body'}>
      Your Absolute CAGR = (F/I)^(1 / D) - 1
      </Text>
      <Text fontSize={FontSizes.size15} fontFamily={'$body'}>
        Where:
      </Text>
      <View ml={wp(2)} rowGap={hp(1)}>
        <KeyValueText title="F(Final Value)" value="The ending value or the current value of your investment after the specified duration." />
        <KeyValueText title="I(Initial Value)" value="The starting value or principal investment amount." />
        <KeyValueText title="D(Duration)" value="The length of time, in years, for which you held the investment." />
      </View>
      <KeyValueText title="Your Absolute CAGR" value="The Compound Annual Growth Rate calculated based on the initial value, final value, and costs." />
      <KeyValueText title="Your Absolute CAGR Percentage" value="represents the annualized growth rate of your investment expressed as a percentage" />
      <KeyValueText title="Your Absolute Returns" value="The total return on your investment, accounting for the initial value and final value" />
    </View>
  )
}

export default CagrCalculatorFormula
