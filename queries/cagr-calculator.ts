import { round } from "lodash"

export function calculateCagr(initialValue: number, finalValue: number, durationOfInvestment: number) {
    /** Calculating absolute CAGR and %age */
    const absoluteCAGR = Math.pow(finalValue / initialValue, 1 / durationOfInvestment) - 1
    const percentageCAGR = (absoluteCAGR * 100).toFixed(2)
  
    /** Calculating absolute returns */
    const absoluteReturns = (finalValue / initialValue - 1) * 100
  
    /** Calculating amount based of CAGR for each year */
    let initialVal = initialValue
    // const barChartData = [
    //   {
    //     name: 'Year 0',
    //     value: round(initialValue, 2),
    //   },
    // ]
  
    for (let i = 1; i < durationOfInvestment + 1; i++) {
      const amountThisYear = initialVal * (1 + absoluteCAGR)
    //   barChartData.push({
    //     name: `Year ${i}`,
    //     value: round(amountThisYear, 2),
    //   })
      initialVal = amountThisYear
    }
  
    return {
      absoluteCAGR: absoluteCAGR.toFixed(2),
      absoluteReturns: absoluteReturns.toFixed(2),
      percentageCAGR,
      durationOfInvestment,
    //   barChartData,
    }
  }