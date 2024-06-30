import dayjs from 'dayjs'
import { monthName } from './constant/constant'

export const formatDate = (date: Date | string, formate: string = 'MMM DD, YYYY'): string => {
  return dayjs(date).format(formate)
}

export const getLastTenYears = (): string[] => {
  const currentYear = new Date().getFullYear()
  const lastTenYears: string[] = []

  for (let i = currentYear; i > currentYear - 10; i--) {
    lastTenYears.push(String(i))
  }

  return lastTenYears
}

// Function to convert month name to its respective index
export const getMonthIndex = (month: string): number => {
  const months: string[] = monthName
  return months.indexOf(month)
}

export const formatIndianMoneyNotation = (num: number | string = '0', fixed: number = 2): string => {
  let parsedNum: number

  if (typeof num === 'string') {
    parsedNum = parseFloat(num)
    if (isNaN(parsedNum)) return 'Invalid input'
  } else {
    parsedNum = num
  }

  const absNum = Math.abs(parsedNum)

  if (absNum >= 10000000) {
    const crValue = absNum / 10000000
    const formattedValue = `${crValue.toFixed(fixed)} Cr`
    return parsedNum < 0 ? `-${formattedValue}` : formattedValue
  } else if (absNum >= 100000) {
    const lacsValue = absNum / 100000
    const formattedValue = `${lacsValue.toFixed(fixed)} Lacs`
    return parsedNum < 0 ? `-${formattedValue}` : formattedValue
  } else if (absNum >= 1000) {
    const kValue = absNum / 1000
    const formattedValue = `${kValue.toFixed(fixed)} K`
    return parsedNum < 0 ? `-${formattedValue}` : formattedValue
  } else {
    return parsedNum?.toString()
  }
}
