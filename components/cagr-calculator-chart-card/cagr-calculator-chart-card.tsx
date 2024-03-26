import React, { FC, useContext } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { Button, Text, View, useTheme } from 'tamagui'
import round from 'lodash/round'
import { useToast } from 'native-base'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'
import { CagrCalculatorContext } from '@/context/cagr-calculator-provider'
import { generateExcelFileForCagrCalculator } from '@/utils/cagr-calculator-helpers'

const ChartCenterLabel: FC<{ CAGRReturnsValue: number }> = ({ CAGRReturnsValue }) => {
  return (
    <View bg="$backgroundHover" ai="center" rowGap={wp(2)} px={wp(1)} br={wp(50)}>
      <Text fontSize={FontSizes.size16} textAlign="center" fontFamily="$heading" color="$foreground">
      CAGR
      </Text>
      <Text
        color="$foreground"
        numberOfLines={1}
        textAlign="center"
        adjustsFontSizeToFit
        fontSize={FontSizes.size22}
        fontFamily="$heading"
      >
        {(CAGRReturnsValue|| 0) + '% p.a'}
      </Text>
    </View>
  )
}

const ChartAgendaItem = ({ color = '', title = '', percentage = 0 }) => {
  return (
    <View fd="row" ai="center" columnGap={wp(2)}>
      <View h={wp(3)} w={wp(3)} bg={color} />
      <Text fontFamily={'$heading'} fontSize={FontSizes.size12}>
        {title} :- {percentage || 0} ₹
      </Text>
    </View>
  )
}

const CagrCalculatorChartCard = () => {
  const { calculationResults, isValidInputs, excelData } = useContext(CagrCalculatorContext)
  const toast = useToast()
  const theme = useTheme()
  const initialValue = round(parseInt(excelData[0]?.initialValue) || 0)
  const finalValue = round(parseInt(excelData[0]?.finalValue) || 0)

  const data = isValidInputs
    ? [
        { value: initialValue, color: '#9e54dd' },
        { value: finalValue, color: '#34c3ff' },
      ]
    : [{ value: 100, color: theme.backgroundFocus.get() }]

  const handleExportToExcel = async () => {
    await generateExcelFileForCagrCalculator(excelData,[])
    toast.show({ title: 'File Saved to your documents' })
  }

  return (
    <View
      bg="$background"
      px={wp(4)}
      py={hp(1.5)}
      br={wp(4)}
      mt={hp(10)}
      ai="center"
      elevationAndroid={3}
      shadowOffset={{ height: 0, width: 0 }}
      shadowColor="black"
      shadowOpacity={0.1}
      shadowRadius={wp(1)}
      mx={wp(4)}
    >
      <View top={-wp(24) + -hp(1.5)}>
        <PieChart
          data={data}
          donut
          centerLabelComponent={() => <ChartCenterLabel CAGRReturnsValue={+(calculationResults?.percentageCAGR || 0)} />}
          radius={wp(24)}
          innerRadius={wp(18)}
          innerCircleColor={theme.backgroundHover.get()}
        />
      </View>
      <View t={-wp(20)} ai="center" h={hp(13)}>
        <View fd="row" ai="center" columnGap={wp(4)}>
          <ChartAgendaItem
            color="#9e54dd"
            title="Initial Value"
            percentage={initialValue}
          />
          <ChartAgendaItem
            color="#34c3ff"
            title="Final Value"
            percentage={finalValue}
          />
        </View>
        <View fd="row" ai="center" columnGap={wp(12)} mt={hp(3)}>
          <View ai="center" rowGap={hp(1)}>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size15}>
            Absolute returns
            </Text>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size20}>
              {(calculationResults?.absoluteReturns || 0) + ' %'}
            </Text>
          </View>
        </View>
        <View fd="row" ai="center" columnGap={wp(4)} mt={hp(4)}>
          <Button
            fontSize={FontSizes.size15}
            onPress={handleExportToExcel}
            disabled={!isValidInputs}
            backgroundColor={THEME_COLORS.primary[50]}
            color={'white'}
            h={hp(5.5)}
          >
            Export to Excel
          </Button>
        </View>
      </View>
    </View>
  )
}

export default CagrCalculatorChartCard
