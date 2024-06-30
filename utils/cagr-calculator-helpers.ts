import round from 'lodash/round'
import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system'

export const generateExcelFileForCagrCalculator = async (data: any, repayment_table: any[]) => {
  const wb = XLSX.utils.book_new()
  const cagrCalculationWorksheet = XLSX.utils.json_to_sheet(data) ?? []
  const cagrMonthlyCalculationWorksheet = XLSX.utils.json_to_sheet(repayment_table ?? []) ?? []
  const emiCalculationJson = XLSX.utils.sheet_to_json(cagrCalculationWorksheet, { header: 1 })
  const emiMonthlyCalculationJson = XLSX.utils.sheet_to_json(cagrMonthlyCalculationWorksheet, { header: 1 })
  const mergedWorksheet = emiCalculationJson.concat([[''], [''], ['']]).concat(emiMonthlyCalculationJson)
  const finalWorksheet = XLSX.utils.json_to_sheet(mergedWorksheet, { skipHeader: true })
  XLSX.utils.book_append_sheet(wb, finalWorksheet, 'CAGR Calculation')
  const wbout = XLSX.write(wb, {
    type: 'base64',
    bookType: 'xlsx',
  })
  const uri = FileSystem.documentDirectory + 'cagr_calculation.xlsx'
  await FileSystem.writeAsStringAsync(uri, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  })
}
