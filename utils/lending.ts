import { formatIndianMoneyNotation } from './format-money'

export const describeTransaction = (amount: string | number) => {
  if (typeof amount === 'string') {
    const balance = parseFloat(amount)
    if (balance < 0) {
      return `You borrowed ${formatIndianMoneyNotation(Math.abs(balance))}`
    } else if (balance > 0) {
      return `You lent ${formatIndianMoneyNotation(balance)}`
    } else {
      return 'The balance is zero'
    }
  }
}

export const TRANSACTION_TYPES = [
  { id: 'lend', value: 'Lend', label: 'Lend' },
  { id: 'borrow', value: 'Borrow', label: 'Borrow' },
]

export const PAYMENT_METHODS = [
  { id: 'UPI', value: 'UPI', label: 'UPI' },
  { id: 'Card', value: 'Card', label: 'Card' },
  { id: 'Cash', value: 'Cash', label: 'Cash' },
  { id: 'NetBanking', value: 'NetBanking', label: 'NetBanking' },
]

export function calculateTransactionAmount(type: 'lend' | 'borrow', amount: number): number {
  if (type === 'lend') {
    return amount // Positive amount for lending
  } else if (type === 'borrow') {
    return -amount // Negative amount for borrowing
  } else {
    throw new Error('Invalid transaction type. Use "lend" or "borrow".')
  }
}
