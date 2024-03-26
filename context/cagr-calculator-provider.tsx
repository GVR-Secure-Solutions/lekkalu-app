import React, { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useMemo, useState } from 'react'
import { calculateCagr } from '@/queries/cagr-calculator'

interface CagrCalculatorContextValue {
  setInitialValue: Dispatch<SetStateAction<string>>
  setFinalValue: Dispatch<SetStateAction<string>>
  setInvestmentDuration: Dispatch<SetStateAction<string>>
  calculationResults?: {
    absoluteCAGR: string,
    absoluteReturns: string,
    percentageCAGR: string,
    durationOfInvestment: number,
  }
  isValidInputs: boolean
  excelData: {
    absoluteCAGR: string | undefined
    absoluteReturns: string | undefined
    percentageCAGR: string | undefined
    initialValue: string
    finalValue: string
    investmentDuration: string
  }[]
}


export const CagrCalculatorContext = createContext<CagrCalculatorContextValue>({} as CagrCalculatorContextValue)

const CagrCalculatorProvider: FC<PropsWithChildren> = (props) => {
  const [initialValue, setInitialValue] = useState('5000')
  const [finalValue, setFinalValue] = useState('25000')
  const [investmentDuration, setInvestmentDuration] = useState('5')

  const calculationResults = calculateCagr(parseInt(initialValue),parseInt(finalValue),parseInt(investmentDuration));

  const excelData = useMemo(() => {
    const data = {
      absoluteCAGR: calculationResults?.absoluteCAGR,
      absoluteReturns: calculationResults?.absoluteReturns,
      percentageCAGR: calculationResults?.percentageCAGR,
    }
    return [{  initialValue, finalValue, investmentDuration, ...data }]
  }, [calculationResults, finalValue, initialValue, investmentDuration])

  const isValidInputs = !!(+finalValue && +initialValue && +investmentDuration && calculationResults)

  const value: CagrCalculatorContextValue = {
    setInitialValue,
    setFinalValue,
    setInvestmentDuration,
    calculationResults,
    isValidInputs,
    excelData,
  }

  return <CagrCalculatorContext.Provider value={value}>{props.children}</CagrCalculatorContext.Provider>
}

export default CagrCalculatorProvider
